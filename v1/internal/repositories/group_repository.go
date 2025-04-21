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

type groupRepository struct {
	store db.SqlDataStore
}

func NewGroupRepository(store db.SqlDataStore) types.GroupRepository {
	return &groupRepository{store: store}
}

func (r groupRepository) Create(ctx context.Context, item models.Group) (models.Group, error) {
	tx, err := r.store.WithContext(ctx).Begin()
	if err != nil {
		return item, err
	}
	err = tx.Exec(
		"INSERT INTO groups (id, name, system) VALUES ($1, $2, $3)",
		item.ID,
		item.Name,
		item.System,
	)
	if err != nil {
		tx.Rollback()
		return item, err
	}
	q := "INSERT INTO group_roles (group_id, role_id) VALUES ($1, $2)"
	for _, role := range item.Roles {
		if err := tx.Exec(q, item.ID, role.ID); err != nil {
			tx.Rollback()
			return item, err
		}
	}
	return item, tx.Commit()
}

func (r groupRepository) Update(ctx context.Context, group models.Group) (models.Group, error) {
	q := "UPDATE groups SET name=$1 WHERE id=$2"
	err := r.store.WithContext(ctx).Exec(q, group.Name, group.ID)
	return group, err
}

func (r groupRepository) Search(ctx context.Context, sb *sql.SqlBuilder) ([]models.Group, error) {
	var found []dto.GroupTable
	q := "SELECT id, name, system FROM groups" + sb.Query()
	err := r.store.WithContext(ctx).QueryAll(q, &found, sb.WhereValues()...)
	if err != nil || len(found) == 0 {
		return []models.Group{}, err
	}
	var groups []models.Group
	for _, item := range found {
		group := converters.NewGroupConverter().FromTableToModel(item)
		roles, _ := r.getRolesByGroup(ctx, group.ID)
		group.Roles = roles
		groups = append(groups, group)
	}
	return groups, nil
}

func (r groupRepository) SearchByRole(ctx context.Context, role models.Role) ([]models.Group, error) {
	var found []dto.GroupTable
	q := "SELECT g.id, g.name, g.system FROM groups g, group_roles gr WHERE gr.group_id=g.id AND gr.role_id=$1 ORDER BY g.name ASC LIMIT 100"
	err := r.store.WithContext(ctx).QueryAll(q, &found, role.ID)
	if err != nil || len(found) == 0 {
		return []models.Group{}, err
	}
	var groups []models.Group
	for _, item := range found {
		group := converters.NewGroupConverter().FromTableToModel(item)
		roles, _ := r.getRolesByGroup(ctx, group.ID)
		group.Roles = roles
		groups = append(groups, group)
	}
	return groups, nil
}

func (r groupRepository) Remove(ctx context.Context, item models.Group) error {
	return r.store.WithContext(ctx).Exec("DELETE FROM groups WHERE id=$1 AND system=$2", item.ID, false)
}

func (r groupRepository) AttachRoles(ctx context.Context, group models.Group) error {
	tx, err := r.store.WithContext(ctx).Begin()
	if err != nil {
		return err
	}
	err = tx.Exec("DELETE FROM group_roles WHERE group_id=$1", group.ID)
	if err != nil {
		tx.Rollback()
		return err
	}
	q := "INSERT INTO group_roles (group_id, role_id) VALUES ($1, $2)"
	for _, role := range group.Roles {
		if err := tx.Exec(q, group.ID, role.ID); err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func (r groupRepository) GetByName(ctx context.Context, name string) (models.Group, error) {
	var found dto.GroupTable
	q := "SELECT id, name, system FROM groups WHERE name=$1"
	err := r.store.WithContext(ctx).QueryOne(q, &found, name)
	if err != nil {
		return models.Group{}, err
	}
	roles, err := r.getRolesByGroup(ctx, found.ID)
	if err != nil {
		return models.Group{}, err
	}
	group := converters.NewGroupConverter().FromTableToModel(found)
	group.Roles = roles
	return group, nil
}

func (r groupRepository) getRolesByGroup(ctx context.Context, id uint64) ([]models.Role, error) {
	var items []dto.RoleTable
	q := "SELECT r.id, r.name, r.permissions, r.system FROM roles r, group_roles gr WHERE gr.role_id=r.id AND gr.group_id=$1"
	if err := r.store.WithContext(ctx).QueryAll(q, &items, id); err != nil {
		return []models.Role{}, err
	}
	roles := converters.NewRoleConverter().FromRecordsToModels(items)
	return roles, nil
}
