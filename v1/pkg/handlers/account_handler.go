package handlers

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/internal/validator"
	"github.com/ravoni4devs/argonauth/v1/pkg/config"
	"github.com/ravoni4devs/argonauth/v1/pkg/converters"
	"github.com/ravoni4devs/argonauth/v1/pkg/datastores"
	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/jwt"
	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
	"github.com/ravoni4devs/argonauth/v1/pkg/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/services"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/customerror"
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
	var conf = params.Config()
	return &AccountHandler{
		conf:      conf,
		params:    params,
		log:       params.Logger(),
		repos:     params.Repos(),
		cache:     datastores.New().MemoryCache(),
		validator: validator.New(),
		jwtManager: jwt.New(jwt.Config{
			Secret:     conf.TokenSecret,
			Audience:   conf.TokenAudience,
			Issuer:     conf.TokenIssuer,
			Expiration: conf.TokenExpiration,
		}),
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
	if !h.conf.EnableStatefulAuth {
		return c.JSON(http.StatusExpectationFailed, res.Fail(errors.New("stateful auth is disabled")))
	}
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
	response := map[string]any{
		"id": result.ID,
		"user":  result,
	}
	return c.JSON(http.StatusOK, res.Success(response))
}

func (h *AccountHandler) Login(c echo.Context) error {
	var res = dto.NewHttpResponse()
	if h.conf.DisableStatelessAuth {
		return c.JSON(http.StatusExpectationFailed, res.Fail(errors.New("stateless auth is disabled")))
	}
	found, err := h.authenticate(c)
	if err != nil {
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	token, err := h.generateToken(found)
	if err != nil {
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewUserConverter().FromModelToUserLoginResponse(found)
	if h.conf.ReturnUserRoles {
		result.Roles = found.Roles()
	}
	response := map[string]any{
		"token": token,
		"id": result.ID,
		"user":  result,
	}
	return c.JSON(http.StatusOK, res.Success(response))
}

func (h *AccountHandler) Logout(c echo.Context) error {
	userIDContext := c.Get(h.conf.GetUserKey())
	if userIDContext == nil {
		return c.JSON(http.StatusPreconditionFailed, "user ID not in context")
	}
	userID := userIDContext.(string)
	_, ok := h.cache.Get(userID)
	if ok {
		h.cache.Delete(userID)
	}
	cookie := h.cookie()
	if cookie != nil {
		cookie.MaxAge = -1
		cookie.Expires = time.Now().Add(time.Second * -1)
		c.SetCookie(cookie)
	}
	return c.JSON(http.StatusNoContent, nil)
}

func (h *AccountHandler) Setup(c echo.Context) error {
	var res = dto.NewHttpResponse()
	err := h.SetupFunc(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	return c.JSON(http.StatusCreated, res.Success("ok"))
}

func (h *AccountHandler) SetupFunc(c echo.Context) error {
	var ctx = c.Request().Context()
	var req dto.SetupRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return err
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return err
	}
	var service = services.NewAccountService(services.Params{
		Repos:  h.repos,
		Config: h.params.Config(),
	})
	err := service.CreateDatabase(ctx)
	if err != nil {
		h.log.Error("create database", err)
		return err
	}
	converter := converters.NewUserConverter()
	account := converter.FromUserRegisterRequestToModel(req.UserRegisterRequest)
	_, err = service.CreateAdmin(ctx, account)
	if err != nil {
		h.log.Error("saving error", customerror.Wrap(err))
		return err
	}
	return nil
}

func (h *AccountHandler) getService() types.AccountService {
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
	if h.conf.UseCache {
		h.cache.Set(saved.ID, saved, time.Duration(time.Minute*5))
	}
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
	if !h.conf.UseCache {
		return service.Login(ctx, account)
	}
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
