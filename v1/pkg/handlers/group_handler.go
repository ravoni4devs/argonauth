package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/internal/validator"
	"github.com/ravoni4devs/argonauth/v1/pkg/config"
	"github.com/ravoni4devs/argonauth/v1/pkg/converters"
	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/customerror"
	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid"
)

type GroupHandler struct {
	validator validator.Validator
	repos     types.RepositoryContainer
	log       logger.Logger
	conf      config.Config
	params    *Params
}

func NewGroupHandler(params *Params) *GroupHandler {
	return &GroupHandler{
		log:       params.Logger(),
		repos:     params.Repos(),
		conf:      params.Config(),
		params:    params,
		validator: validator.New(),
	}
}

func (h *GroupHandler) Search(c echo.Context) error {
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
			sb.AndWhere("name", "LIKE", "%"+req.Term+"%"),
		)
	}
	found, err := h.repos.GroupRepository().Search(ctx, sb)
	if err != nil {
		h.log.Error("search failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewGroupConverter().FromModelsToSearchResponse(found)
	return c.JSON(http.StatusOK, res.Success(result))
}

func (h *GroupHandler) Create(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req dto.GroupCreateRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	var groupRepository = h.repos.GroupRepository()
	var groupConverter = converters.NewGroupConverter()
	item := groupConverter.FromCreateRequestToModel(req)
	item.ID = uniqid.New().ID()
	saved, err := groupRepository.Create(ctx, item)
	if err != nil {
		h.log.Error("create failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := groupConverter.FromModelToResponse(saved)
	return c.JSON(http.StatusCreated, res.Success(result))
}

func (h *GroupHandler) Update(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req dto.GroupUpdateRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	req.ID = c.Param("id")
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	item := converters.NewGroupConverter().FromUpdateRequestToModel(req)
	saved, err := h.repos.GroupRepository().Update(ctx, item)
	if err != nil {
		h.log.Error("updated failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewGroupConverter().FromModelToResponse(saved)
	return c.JSON(http.StatusOK, res.Success(result))
}

func (h *GroupHandler) Remove(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req = dto.GroupUpdateRequest{ID: c.Param("id")}
	item := converters.NewGroupConverter().FromUpdateRequestToModel(req)
	err := h.repos.GroupRepository().Remove(ctx, item)
	if err != nil {
		h.log.Error("remove failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	return c.JSON(http.StatusNoContent, nil)
}

func (h *GroupHandler) AttachRoles(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	var req dto.GroupEditRolesRequest
	if err := c.Bind(&req); err != nil {
		h.log.Error("bind request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	req.ID = c.Param("id")
	if err := h.validator.Validate(req); err != nil {
		h.log.Error("validate request", err)
		return c.JSON(http.StatusBadRequest, res.Fail(err))
	}
	item := converters.NewGroupConverter().FromEditRolesRequestToModel(req)
	err := h.repos.GroupRepository().AttachRoles(ctx, item)
	if err != nil {
		h.log.Error("updated failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	return c.JSON(http.StatusNoContent, res.Success(nil))
}

func (h *GroupHandler) GetUsers(c echo.Context) error {
	var res = dto.NewHttpResponse()
	var ctx = c.Request().Context()
	group := converters.NewGroupConverter().FromGroupRequestToModel(dto.GroupRequest{ID: c.Param("id")})
	found, err := h.repos.UserRepository().SearchByGroup(ctx, group)
	if err != nil {
		h.log.Error("get groups failed", err)
		return c.JSON(customerror.StatusCodeFrom(err), res.Fail(err))
	}
	result := converters.NewUserConverter().FromModelsToSearchResponse(found)
	return c.JSON(http.StatusOK, res.Success(result))
}
