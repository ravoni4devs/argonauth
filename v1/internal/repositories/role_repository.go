package repositories

import (
	"context"

	"github.com/ravoni4devs/argonauth/v1/internal/converters"
	db "github.com/ravoni4devs/argonauth/v1/internal/datastores"
	"github.com/ravoni4devs/argonauth/v1/internal/dto"
	"github.com/ravoni4devs/argonauth/v1/internal/models"
	"github.com/ravoni4devs/argonauth/v1/internal/types"
	"github.com/ravoni4devs/argonauth/v1/internal/types/sql"
)

type roleRepository struct {
	store db.SqlDataStore
}

func NewRoleRepository(store db.SqlDataStore) types.RoleRepository {
	return &roleRepository{store: store}
}

func (r roleRepository) Create(ctx context.Context, item models.Role) (models.Role, error) {
	q := "INSERT INTO roles (id, name, permissions, system) VALUES ($1, $2, $3, $4)"
	err := r.store.WithContext(ctx).Exec(
		q,
		item.ID,
		item.Name,
		item.Permissions,
		item.System,
	)
	return item, err
}

func (r roleRepository) Search(ctx context.Context, sb *sql.SqlBuilder) ([]models.Role, error) {
	var found []dto.RoleTable
	q := "SELECT id, name, system, permissions FROM roles" + sb.Query()
	err := r.store.WithContext(ctx).QueryAll(q, &found, sb.WhereValues()...)
	if err != nil || len(found) == 0 {
		return []models.Role{}, err
	}
	roles := converters.NewRoleConverter().FromRecordsToModels(found)
	return roles, nil
}

func (r roleRepository) Remove(ctx context.Context, item models.Role) error {
	return r.store.WithContext(ctx).Exec("DELETE FROM roles WHERE id=$1 AND system=$2", item.ID, false)
}

func (r roleRepository) GetByID(ctx context.Context, id uint64) (models.Role, error) {
	var found dto.RoleTable
	q := "SELECT id, name, permissions, system FROM roles WHERE id=$1"
	err := r.store.WithContext(ctx).QueryOne(q, &found, id)
	if err != nil {
		return models.Role{}, err
	}
	role := converters.NewRoleConverter().FromTableToModel(found)
	return role, nil
}

func (r roleRepository) Update(ctx context.Context, role models.Role) (models.Role, error) {
	q := "UPDATE roles SET name=$1, permissions=$2 WHERE id=$3"
	err := r.store.WithContext(ctx).Exec(q, role.Name, role.Permissions, role.ID)
	return role, err
}

func (r roleRepository) Upsert(ctx context.Context, role models.Role) (models.Role, error) {
	_, err := r.GetByID(ctx, role.ID)
	if err != nil {
		return r.Create(ctx, role)
	}
	q := "UPDATE roles SET name=$1 WHERE id=$2"
	err = r.store.WithContext(ctx).Exec(q, role.Name, role.ID)
	return role, err
}
