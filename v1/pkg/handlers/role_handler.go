package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/pkg/config"
	"github.com/ravoni4devs/argonauth/v1/pkg/converters"
	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
	"github.com/ravoni4devs/argonauth/v1/pkg/services"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/customerror"
	"github.com/ravoni4devs/argonauth/v1/internal/validator"
	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid"
)

type RoleHandler struct {
	validator validator.Validator
	repos     types.RepositoryContainer
	log       logger.Logger
	conf      config.Config
	params    *Params
}

func NewRoleHandler(params *Params) *RoleHandler {
	return &RoleHandler{
		log:       params.Logger(),
		repos:     params.Repos(),
		conf:      params.Config(),
		params:    params,
		validator: validator.New(),
	}
}

func (h *RoleHandler) Search(c echo.Context) error {
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
	if req.Term != "" {
		sb.Where(
			sb.AndWhere("name", "like", "%"+req.Term+"%"),
		)
	}
	found, err := h.repos.RoleRepository().Search(ctx, sb)
	if err != nil {
		h.log.Error("search failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewRoleConverter().FromModelsToSearchResponse(found)
	return c.JSON(http.StatusOK, res.Success(result))
}

func (h *RoleHandler) Create(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req dto.RoleCreateRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	item := converters.NewRoleConverter().FromCreateRequestToModel(req)
	if err := services.NewRoleService().ValidatePermissions(item); err != nil {
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	item.ID = uniqid.New().ID()
	saved, err := h.repos.RoleRepository().Create(ctx, item)
	if err != nil {
		h.log.Error("create failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewRoleConverter().FromModelToResponse(saved)
	return c.JSON(http.StatusCreated, res.Success(result))
}

func (h *RoleHandler) Update(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req dto.RoleUpdateRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	req.ID = c.Param("id")
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	item := converters.NewRoleConverter().FromUpdateRequestToModel(req)
	if err := services.NewRoleService().ValidatePermissions(item); err != nil {
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	saved, err := h.repos.RoleRepository().Update(ctx, item)
	if err != nil {
		h.log.Error("updated failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewRoleConverter().FromModelToResponse(saved)
	return c.JSON(http.StatusOK, res.Success(result))
}

func (h *RoleHandler) Remove(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req = dto.RoleUpdateRequest{ID: c.Param("id")}
	item := converters.NewRoleConverter().FromUpdateRequestToModel(req)
	err := h.repos.RoleRepository().Remove(ctx, item)
	if err != nil {
		h.log.Error("remove failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	return c.JSON(http.StatusNoContent, nil)
}

func (h *RoleHandler) GetGroups(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	role := converters.NewRoleConverter().FromRequestToModel(dto.RoleRequest{ID: c.Param("id")})
	found, err := h.repos.GroupRepository().SearchByRole(ctx, role)
	if err != nil {
		h.log.Error("get groups failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewGroupConverter().FromModelsToSearchResponse(found)
	return c.JSON(http.StatusOK, res.Success(result))
}
