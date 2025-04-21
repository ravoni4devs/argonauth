package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/pkg/config"
	"github.com/ravoni4devs/argonauth/v1/pkg/converters"
	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
	"github.com/ravoni4devs/argonauth/v1/pkg/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/customerror"
	"github.com/ravoni4devs/argonauth/v1/internal/validator"
)

type UserHandler struct {
	validator validator.Validator
	repos     types.RepositoryContainer
	log       logger.Logger
	conf      config.Config
	params    *Params
}

func NewUserHandler(params *Params) *UserHandler {
	return &UserHandler{
		log:       params.Logger(),
		repos:     params.Repos(),
		conf:      params.Config(),
		params:    params,
		validator: validator.New(),
	}
}

func (h *UserHandler) Whoami(c echo.Context) error {
	var res = dto.NewHttpResponse()
	userID := c.Get(h.conf.GetUserKey()).(string)
	return c.JSON(http.StatusOK, res.Success(userID))
}

func (h *UserHandler) Search(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var req dto.SearchRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	var ctx = c.Request().Context()
	if req.OrderBy == "" {
		req.OrderBy = "name"
	}
	sb := converters.NewSearchConverter().FromRequestToSqlBuilder(req)
	term := req.Term
	if term != "" {
		sb.Where(sb.AndWhere("name", "like", "%"+term+"%"),
			sb.OrWhere("email", "like", term+"%"),
		)
	}
	found, err := h.repos.UserRepository().Search(ctx, sb)
	if err != nil {
		h.log.Error("search failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewUserConverter().FromModelsToSearchResponse(found)
	return c.JSON(http.StatusOK, res.Success(result))
}

func (h *UserHandler) Update(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req dto.UserUpdateRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	user := converters.NewUserConverter().FromUserUpdateRequestToModel(req)
	user.ID = c.Param("id")
	_, err := h.repos.UserRepository().Update(ctx, user)
	if err != nil {
		h.log.Error("update failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	return c.JSON(http.StatusNoContent, nil)
}

func (h *UserHandler) SetMemberships(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req dto.UserUpdateGroupsRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	if err := h.validator.Validate(req); err != nil {
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	user := models.User{
		ID:     c.Param("id"),
		Groups: converters.NewGroupConverter().FromGroupsRequestToModels(req.Groups),
	}
	err := h.repos.UserRepository().SetMemberships(ctx, user)
	if err != nil {
		h.log.Error("update failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	return c.JSON(http.StatusNoContent, nil)
}
