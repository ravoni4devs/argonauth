package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/internal/config"
	"github.com/ravoni4devs/argonauth/v1/internal/converters"
	"github.com/ravoni4devs/argonauth/v1/internal/datastores"
	"github.com/ravoni4devs/argonauth/v1/internal/dto"
	"github.com/ravoni4devs/argonauth/v1/internal/jwt"
	"github.com/ravoni4devs/argonauth/v1/internal/logger"
	"github.com/ravoni4devs/argonauth/v1/internal/models"
	"github.com/ravoni4devs/argonauth/v1/internal/services"
	"github.com/ravoni4devs/argonauth/v1/internal/types"
	"github.com/ravoni4devs/argonauth/v1/internal/types/customerror"
	"github.com/ravoni4devs/argonauth/v1/internal/validator"
)

type AccountHandler struct {
	validator  validator.Validator
	converter  converters.UserConverter
	cache      datastores.Cache
	jwtManager jwt.Jwt
	expiration time.Duration
	repos      types.RepositoryContainer
	log        logger.Logger
	conf       config.Config
	params     *Params
}

func NewAccountHandler(params *Params) *AccountHandler {
	return &AccountHandler{
		log:       params.Logger(),
		repos:     params.Repos(),
		conf:      params.Config(),
		params:    params,
		cache:     datastores.New().MemoryCache(),
		validator: validator.New(),
	}
}

func (h *AccountHandler) Register(c echo.Context) error {
	var res = dto.NewHttpResponse()
	saved, err := h.register(c)
	if err != nil {
		h.log.Error("saving error", customerror.Wrap(err))
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	token, err := h.generateToken(saved)
	if err != nil {
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewUserConverter().FromModelToUserRegisterResponse(saved)
	response := map[string]any{
		"token": token,
		"user":  result,
	}
	return c.JSON(http.StatusCreated, res.Success(response))
}

func (h *AccountHandler) PreLogin(c echo.Context) error {
	var ctx = c.Request().Context()
	var res = dto.NewHttpResponse()
	var req dto.UserLoginRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	found, err := h.repos.UserRepository().GetByEmail(ctx, req.Email)
	if err != nil {
		h.log.Error("not found error", customerror.Wrap(err))
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	h.cache.Set(found.ID, found, time.Duration(time.Minute*5))
	converter := converters.NewUserConverter()
	result := converter.FromModelToUserLoginResponse(found)
	return c.JSON(http.StatusOK, res.Success(result))
}

func (h *AccountHandler) LoginWithCookie(c echo.Context) error {
	var res = dto.NewHttpResponse()
	found, err := h.authenticate(c)
	if err != nil {
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	cookie, err := h.generateCookieWithToken(found)
	if err != nil {
		h.log.Error("generate token error", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	c.SetCookie(cookie)
	result := converters.NewUserConverter().FromModelToUserLoginResponse(found)
	return c.JSON(http.StatusOK, res.Success(result))
}

func (h *AccountHandler) Login(c echo.Context) error {
	var res = dto.NewHttpResponse()
	found, err := h.authenticate(c)
	if err != nil {
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	token, err := h.generateToken(found)
	if err != nil {
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewUserConverter().FromModelToUserLoginResponse(found)
	response := map[string]any{
		"token": token,
		"user":  result,
	}
	return c.JSON(http.StatusOK, res.Success(response))
}

func (h *AccountHandler) Logout(c echo.Context) error {
	userID := c.Get(h.conf.GetUserKey()).(string)
	_, ok := h.cache.Get(userID)
	if ok {
		h.cache.Delete(userID)
	}
	cookie := h.cookie()
	cookie.MaxAge = -1
	cookie.Expires = time.Now().Add(time.Second * -1)
	c.SetCookie(cookie)
	return c.JSON(http.StatusNoContent, nil)
}

func (h *AccountHandler) Setup(c echo.Context) error {
	var ctx = c.Request().Context()
	var res = dto.NewHttpResponse()
	var req dto.SetupRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	err := h.repos.Sqlite().WithContext(ctx).CreateDatabase()
	if err != nil {
		h.log.Error("create database", err)
		return c.JSON(http.StatusInternalServerError, res.Fail(err))
	}
	converter := converters.NewUserConverter()
	account := converter.FromUserRegisterRequestToModel(req.UserRegisterRequest)
	service := services.NewAccountService(services.Params{
		Repos:  h.repos,
		Config: h.params.Config(),
	})
	_, err = service.CreateAdmin(ctx, account)
	if err != nil {
		h.log.Error("saving error", customerror.Wrap(err))
		return c.JSON(http.StatusInternalServerError, res.Fail(err))
	}
	return c.JSON(http.StatusCreated, res.Success(map[string]string{"database": "created"}))
}

func (h *AccountHandler) getService() services.AccountService {
	return services.NewAccountService(services.Params{
		Repos:  h.repos,
		Config: h.params.Config(),
	})
}

func (h *AccountHandler) register(c echo.Context) (models.User, error) {
	var ctx = c.Request().Context()
	var req dto.UserRegisterRequest
	var saved models.User
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return saved, err
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("register validate request", err)
		return saved, err
	}
	var service = h.getService()
	var user = converters.NewUserConverter().FromUserRegisterRequestToModel(req)
	var err error
	saved, err = service.Register(ctx, user)
	if err != nil {
		return saved, err
	}
	h.cache.Set(saved.ID, saved, time.Duration(time.Minute*5))
	return saved, nil
}

func (h *AccountHandler) authenticate(c echo.Context) (models.User, error) {
	var ctx = c.Request().Context()
	var req dto.UserLoginRequest
	var found models.User
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return found, customerror.InvalidInput(err, err.Error())
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return found, customerror.InvalidInput(err, err.Error())
	}
	var converter = converters.NewUserConverter()
	var service = h.getService()
	var account = converter.FromUserLoginRequestToModel(req)
	var err error
	cached, ok := h.cache.Get(req.ID)
	if ok {
		found = cached.(models.User)
		err = service.Authenticate(account, found)
	} else {
		found, err = service.Login(ctx, account)
	}
	if err == nil {
		h.cache.Set(found.ID, found, time.Duration(time.Minute*5))
	}
	return found, err
}

func (h *AccountHandler) generateToken(user models.User) (string, error) {
	return h.jwtManager.GenerateToken(user.ID)
}

func (h *AccountHandler) generateCookieWithToken(user models.User) (*http.Cookie, error) {
	token, err := h.generateToken(user)
	if err != nil {
		return nil, err
	}
	cookie := h.cookie()
	cookie.MaxAge = int(h.expiration.Seconds())
	cookie.Value = token
	cookie.Expires = time.Now().Add(time.Second * time.Duration(h.expiration))
	return cookie, nil
}

func (h *AccountHandler) cookie() *http.Cookie {
	cookie := new(http.Cookie)
	cookie.Name = h.conf.GetCookieName()
	cookie.Path = "/"
	cookie.HttpOnly = true
	cookie.Secure = true
	cookie.SameSite = http.SameSiteLaxMode
	return cookie
}

func (h *AccountHandler) cacheIt(ctx context.Context, id string) (models.User, error) {
	cached, ok := h.cache.Get(id)
	if ok {
		return cached.(models.User), nil
	}
	found, err := h.repos.UserRepository().GetByID(ctx, id)
	if err != nil {
		return found, err
	}
	h.cache.Set(found.ID, found, h.expiration)
	return found, nil
}
