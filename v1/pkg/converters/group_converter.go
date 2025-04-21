package converters

import (
	"strconv"

	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/models"
)

type GroupConverter struct {
}

func NewGroupConverter() GroupConverter {
	return GroupConverter{}
}

func (c GroupConverter) FromTableToModel(input dto.GroupTable) models.Group {
	var output = models.Group{}
	output.ID = input.ID
	output.Name = input.Name
	output.System = input.System
	return output
}

func (c GroupConverter) FromRecordsToModels(input []dto.GroupTable) []models.Group {
	var output []models.Group
	for _, item := range input {
		output = append(output, c.FromTableToModel(item))
	}
	return output
}

func (c GroupConverter) FromModelToResponse(input models.Group) dto.GroupResponse {
	var output = dto.GroupResponse{}
	output.ID = strconv.FormatUint(input.ID, 10)
	output.Name = input.Name
	output.Roles = NewRoleConverter().FromModelsToSearchResponse(input.Roles)
	output.CreatedAt = input.CreatedAt.ToISO8601Format()
	output.System = input.System
	return output
}

func (c GroupConverter) FromModelsToSearchResponse(input []models.Group) []dto.GroupResponse {
	var output = make([]dto.GroupResponse, 0)
	for _, i := range input {
		output = append(output, c.FromModelToResponse(i))
	}
	return output
}

func (c GroupConverter) FromUpdateRequestToModel(input dto.GroupUpdateRequest) models.Group {
	var output = models.Group{}
	id, _ := strconv.ParseUint(input.ID, 10, 64)
	output.ID = id
	output.Name = input.Name
	var roles []models.Role
	for _, r := range input.Roles {
		roles = append(roles, NewRoleConverter().FromRequestToModel(r))
	}
	output.Roles = roles
	return output
}

func (c GroupConverter) FromGroupRequestToModel(input dto.GroupRequest) models.Group {
	var output = models.Group{}
	id, _ := strconv.ParseUint(input.ID, 10, 64)
	output.ID = id
	output.Name = input.Name
	output.System = input.System
	return output
}

func (c GroupConverter) FromGroupsRequestToModels(input []dto.GroupRequest) []models.Group {
	var output = []models.Group{}
	for _, i := range input {
		output = append(output, c.FromGroupRequestToModel(i))
	}
	return output
}

func (c GroupConverter) FromCreateRequestToModel(input dto.GroupCreateRequest) models.Group {
	var output = models.Group{}
	output.Name = input.Name
	var roles []models.Role
	for _, r := range input.Roles {
		roles = append(roles, NewRoleConverter().FromRequestToModel(r))
	}
	output.Roles = roles
	return output
}

func (c GroupConverter) FromEditRolesRequestToModel(input dto.GroupEditRolesRequest) models.Group {
	var output = models.Group{}
	id, _ := strconv.ParseUint(input.ID, 10, 64)
	output.ID = id
	var roles []models.Role
	for _, r := range input.Roles {
		roles = append(roles, NewRoleConverter().FromRequestToModel(r))
	}
	output.Roles = roles
	return output
}
