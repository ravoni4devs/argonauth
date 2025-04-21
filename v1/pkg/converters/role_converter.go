package converters

import (
	"strconv"

	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/models"
)

type RoleConverter struct {
}

func NewRoleConverter() RoleConverter {
	return RoleConverter{}
}

func (c RoleConverter) FromTableToModel(input dto.RoleTable) models.Role {
	var output = models.Role{}
	output.ID = input.ID
	output.Name = input.Name
	output.Permissions = input.Permissions
	output.System = input.System
	return output
}

func (c RoleConverter) FromRecordsToModels(input []dto.RoleTable) []models.Role {
	var output []models.Role
	for _, item := range input {
		output = append(output, c.FromTableToModel(item))
	}
	return output
}

func (c RoleConverter) FromModelToResponse(input models.Role) dto.RoleResponse {
	var output = dto.RoleResponse{}
	output.ID = strconv.FormatUint(input.ID, 10)
	output.Name = input.Name
	output.Permissions = input.Permissions
	output.CreatedAt = input.CreatedAt.ToISO8601Format()
	output.System = input.System
	return output
}

func (c RoleConverter) FromModelsToSearchResponse(input []models.Role) []dto.RoleResponse {
	var output = make([]dto.RoleResponse, 0)
	for _, i := range input {
		output = append(output, c.FromModelToResponse(i))
	}
	return output
}

func (c RoleConverter) FromUpdateRequestToModel(input dto.RoleUpdateRequest) models.Role {
	var output = models.Role{}
	id, _ := strconv.ParseUint(input.ID, 10, 64)
	output.ID = id
	output.Name = input.Name
	output.Permissions = input.Permissions
	return output
}

func (c RoleConverter) FromCreateRequestToModel(input dto.RoleCreateRequest) models.Role {
	var output = models.Role{}
	output.Name = input.Name
	output.Permissions = input.Permissions
	return output
}

func (c RoleConverter) FromRequestToModel(input dto.RoleRequest) models.Role {
	id, _ := strconv.ParseUint(input.ID, 10, 64)
	var output = models.Role{}
	output.ID = id
	output.Name = input.Name
	return output
}
