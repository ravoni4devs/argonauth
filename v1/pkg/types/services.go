package types

import (
	"context"

	"github.com/ravoni4devs/argonauth/v1/pkg/models"
)

type AccountService interface {
	Register(ctx context.Context, user models.User) (models.User, error)
	Login(ctx context.Context, user models.User) (models.User, error)
	Authenticate(account, found models.User) error
	CreateAdmin(ctx context.Context, user models.User) (models.User, error)
	CreateDatabase(ctx context.Context) error
}

type RoleService interface {
	ValidatePermissions(role models.Role) error
}
