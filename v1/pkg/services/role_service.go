package services

import (
	"encoding/json"
	"fmt"

	"github.com/ravoni4devs/argonauth/v1/pkg/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
	"github.com/ravoni4devs/argonauth/v1/pkg/rbac"
)

type roleService struct {
}

func NewRoleService() types.RoleService {
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
