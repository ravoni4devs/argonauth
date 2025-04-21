package types

import (
	"context"

	"github.com/ravoni4devs/argonauth/v1/internal/datastores"
	"github.com/ravoni4devs/argonauth/v1/internal/types/sql"
	"github.com/ravoni4devs/argonauth/v1/internal/models"
)

type RepositoryContainer interface {
	Sqlite() datastores.SqlDataStore
	UserRepository() UserRepository
	GroupRepository() GroupRepository
	RoleRepository() RoleRepository
}

type UserRepository interface {
	Create(ctx context.Context, item models.User) (models.User, error)
	Update(ctx context.Context, item models.User) (models.User, error)
	Search(ctx context.Context, sb *sql.SqlBuilder) ([]models.User, error)
	SearchAuthors(ctx context.Context, sb *sql.SqlBuilder) ([]models.User, error)
	SearchByGroup(ctx context.Context, group models.Group) ([]models.User, error)
	GetByEmail(ctx context.Context, email string) (models.User, error)
	GetByID(ctx context.Context, id string) (models.User, error)
	GetGroups(ctx context.Context, user models.User) ([]models.Group, error)
	AddMembership(ctx context.Context, user models.User, group models.Group) error
	SetMemberships(ctx context.Context, user models.User) error
}

type GroupRepository interface {
	Create(ctx context.Context, item models.Group) (models.Group, error)
	Update(ctx context.Context, group models.Group) (models.Group, error)
	Remove(ctx context.Context, item models.Group) error
	Search(ctx context.Context, sb *sql.SqlBuilder) ([]models.Group, error)
	SearchByRole(ctx context.Context, role models.Role) ([]models.Group, error)
	GetByName(ctx context.Context, name string) (models.Group, error)
	AttachRoles(ctx context.Context, group models.Group) error
}

type RoleRepository interface {
	Create(ctx context.Context, item models.Role) (models.Role, error)
	Update(ctx context.Context, role models.Role) (models.Role, error)
	Remove(ctx context.Context, item models.Role) error
	Search(ctx context.Context, sb *sql.SqlBuilder) ([]models.Role, error)
	GetByID(ctx context.Context, id uint64) (models.Role, error)
	Upsert(ctx context.Context, role models.Role) (models.Role, error)
}
