package converters

import (
	"github.com/ravoni4devs/argonauth/v1/internal/dto"
	"github.com/ravoni4devs/argonauth/v1/internal/models"
)

type UserConverter struct {
}

func NewUserConverter() UserConverter {
	return UserConverter{}
}

func (c UserConverter) FromUserRegisterRequestToModel(input dto.UserRegisterRequest) models.User {
	var output = models.User{}
	output.Name = input.Name
	output.Avatar = input.Avatar
	output.Email = input.Email
	output.Password = input.Password
	output.Salt = input.Salt
	// output.PrivateKey = input.PrivateKey
	// output.PublicKey = input.PublicKey
	return output
}

func (c UserConverter) FromModelToUserRegisterResponse(input models.User) dto.UserRegisterResponse {
	var output = dto.UserRegisterResponse{}
	output.ID = input.ID
	output.Name = input.Name
	output.Avatar = input.Avatar
	output.Email = input.Email
	return output
}

func (c UserConverter) FromUserLoginRequestToModel(input dto.UserLoginRequest) models.User {
	var output = models.User{}
	output.ID = input.ID
	output.Email = input.Email
	output.Password = input.Password
	return output
}

func (c UserConverter) FromUserRequestToModel(input dto.UserRequest) models.User {
	var output = models.User{}
	output.ID = input.ID
	output.Email = input.Email
	output.Name = input.Name
	output.Avatar = input.Avatar
	return output
}

func (c UserConverter) FromModelToUserLoginResponse(input models.User) dto.UserLoginResponse {
	var output = dto.UserLoginResponse{}
	output.ID = input.ID
	output.Name = input.Name
	output.Avatar = input.Avatar
	output.Email = input.Email
	output.Salt = input.Salt
	return output
}

func (c UserConverter) FromTableToModel(input dto.UserTable) models.User {
	output := models.User{}
	output.ID = input.ID
	output.Name = input.Name
	output.Email = input.Email
	output.Password = input.Password
	output.Salt = input.Salt
	output.Avatar = input.Avatar
	output.Blocked = input.Blocked
	// output.PrivateKey = input.PrivateKey
	// output.PublicKey = input.PublicKey
	return output
}

func (c UserConverter) FromRecordsToModels(input []dto.UserTable) []models.User {
	var output []models.User
	for _, i := range input {
		output = append(output, c.FromTableToModel(i))
	}
	return output
}

func (c UserConverter) FromModelToResponse(input models.User) dto.UserResponse {
	var output = dto.UserResponse{}
	output.ID = input.ID
	output.Name = input.Name
	output.Email = input.Email
	output.Blocked = input.Blocked
	output.Avatar = input.Avatar
	var groups []dto.GroupResponse
	for _, g := range input.Groups {
		groups = append(groups, NewGroupConverter().FromModelToResponse(g))
	}
	output.Groups = groups
	return output
}

func (c UserConverter) FromModelsToSearchResponse(input []models.User) []dto.UserResponse {
	var output = make([]dto.UserResponse, 0)
	for _, i := range input {
		output = append(output, c.FromModelToResponse(i))
	}
	return output
}

func (c UserConverter) FromUserUpdateRequestToModel(input dto.UserUpdateRequest) models.User {
	var output = models.User{}
	output.Name = input.Name
	output.Blocked = input.Blocked
	output.Avatar = input.Avatar
	return output
}
