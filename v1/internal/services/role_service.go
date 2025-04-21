package services

import (
	"encoding/json"
	"fmt"

	"github.com/ravoni4devs/argonauth/v1/internal/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/rbac"
)

type RoleService interface {
	ValidatePermissions(role models.Role) error
}

type roleService struct {
}

func NewRoleService() RoleService {
	return &roleService{}
}

func (s *roleService) ValidatePermissions(role models.Role) error {
	var permissions []rbac.Permission
	err := json.Unmarshal([]byte(role.Permissions), &permissions)
	if err != nil {
		return err
	}
	for _, permission := range permissions {
		if !permission.IsValid() {
			return fmt.Errorf("permission contain invalid action %s", permission.Action)
		}
	}
	return nil
}
