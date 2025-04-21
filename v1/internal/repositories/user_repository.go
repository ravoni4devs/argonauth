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

type userRepository struct {
	store db.SqlDataStore
}

func NewUserRepository(store db.SqlDataStore) types.UserRepository {
	return &userRepository{store: store}
}

func (r userRepository) Create(ctx context.Context, item models.User) (models.User, error) {
	err := r.store.WithContext(ctx).Exec(
		"INSERT INTO users (id, name, avatar, email,  password, salt) VALUES ($1, $2, $3, $4, $5, $6)",
		item.ID,
		item.Name,
		item.Avatar,
		item.Email,
		item.Password,
		item.Salt,
	)
	return item, err
}

func (r userRepository) Update(ctx context.Context, item models.User) (models.User, error) {
	err := r.store.WithContext(ctx).Exec(
		"UPDATE users SET name=$1, blocked=$2, avatar=$3 WHERE id=$4",
		item.Name,
		item.Blocked,
		item.Avatar,
		item.ID,
	)
	return item, err
}

func (r userRepository) Search(ctx context.Context, sb *sql.SqlBuilder) ([]models.User, error) {
	var found []dto.UserTable
	q := "SELECT id, name, email, avatar, blocked FROM users" + sb.Query()
	err := r.store.WithContext(ctx).QueryAll(q, &found, sb.WhereValues()...)
	if err != nil || len(found) == 0 {
		return []models.User{}, err
	}
	var converter = converters.NewUserConverter()
	var users []models.User
	for _, item := range found {
		groups, err := r.getGroupsByUser(ctx, item.ID)
		if err != nil {
			return users, err
		}
		user := converter.FromTableToModel(item)
		user.Groups = groups
		users = append(users, user)
	}
	return users, nil
}

func (r userRepository) SearchAuthors(ctx context.Context, sb *sql.SqlBuilder) ([]models.User, error) {
	var found []dto.UserTable
	q := `SELECT DISTINCT u.id, u.name, u.email, u.avatar, u.blocked
		  FROM users u, groups g, memberships m` + sb.Query()
	err := r.store.WithContext(ctx).QueryAll(q, &found, sb.WhereValues()...)
	if err != nil || len(found) == 0 {
		return []models.User{}, err
	}
	users := converters.NewUserConverter().FromRecordsToModels(found)
	return users, nil
}

func (r userRepository) AddMembership(ctx context.Context, user models.User, group models.Group) error {
	q := "INSERT INTO memberships (group_id, user_id) VALUES ($1, $2)"
	return r.store.WithContext(ctx).Exec(q, group.ID, user.ID)
}

func (r userRepository) SetMemberships(ctx context.Context, user models.User) error {
	var err error
	tx, err := r.store.WithContext(ctx).Begin()
	if err != nil {
		return err
	}
	err = tx.Exec("DELETE FROM memberships WHERE user_id=$1", user.ID)
	if err != nil && err.Error() != "no rows affected" {
		tx.Rollback()
		return err
	}
	for _, group := range user.Groups {
		err = tx.Exec("INSERT INTO memberships (group_id, user_id) VALUES ($1, $2)", group.ID, user.ID)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func (r userRepository) GetByID(ctx context.Context, id string) (models.User, error) {
	var found dto.UserTable
	q := "SELECT id, name, email, avatar, password, salt, blocked FROM users WHERE id=$1"
	err := r.store.WithContext(ctx).QueryOne(q, &found, id)
	if err != nil {
		return models.User{}, err
	}
	user := converters.NewUserConverter().FromTableToModel(found)
	groups, err := r.getGroupsByUser(ctx, user.ID)
	if err != nil {
		return user, err
	}
	user.Groups = groups
	return user, nil
}

func (r userRepository) GetByEmail(ctx context.Context, email string) (models.User, error) {
	var found dto.UserTable
	q := "SELECT id, name, email, avatar, password, salt, blocked FROM users WHERE email=$1"
	err := r.store.WithContext(ctx).QueryOne(q, &found, email)
	if err != nil {
		return models.User{}, err
	}
	user := converters.NewUserConverter().FromTableToModel(found)
	groups, err := r.getGroupsByUser(ctx, user.ID)
	if err != nil {
		return user, err
	}
	user.Groups = groups
	return user, nil
}

func (r userRepository) GetGroups(ctx context.Context, user models.User) ([]models.Group, error) {
	return r.getGroupsByUser(ctx, user.ID)
}

func (r userRepository) SearchByGroup(ctx context.Context, group models.Group) ([]models.User, error) {
	var found []dto.UserTable
	q := "SELECT u.id, u.name, u.email, u.avatar FROM users u, memberships m WHERE m.user_id=u.id AND m.group_id=$1 ORDER BY u.name ASC LIMIT 100"
	err := r.store.WithContext(ctx).QueryAll(q, &found, group.ID)
	if err != nil || len(found) == 0 {
		return []models.User{}, err
	}
	return converters.NewUserConverter().FromRecordsToModels(found), nil
}

func (r userRepository) getGroupsByUser(ctx context.Context, id string) ([]models.Group, error) {
	var items []dto.GroupTable
	q := "SELECT g.id, g.name FROM groups g, memberships m WHERE m.group_id=g.id AND m.user_id=$1"
	if err := r.store.WithContext(ctx).QueryAll(q, &items, id); err != nil {
		return []models.Group{}, err
	}
	var groups []models.Group
	converter := converters.NewGroupConverter()
	for _, item := range items {
		roles, err := r.getRolesByGroup(ctx, item.ID)
		if err != nil {
			return groups, err
		}
		group := converter.FromTableToModel(item)
		group.Roles = roles
		groups = append(groups, group)
	}
	return groups, nil
}

func (r userRepository) getRolesByGroup(ctx context.Context, id uint64) ([]models.Role, error) {
	var items []dto.RoleTable
	q := "SELECT r.id, r.name, r.permissions FROM roles r, group_roles gr WHERE gr.role_id=r.id AND gr.group_id=$1"
	if err := r.store.WithContext(ctx).QueryAll(q, &items, id); err != nil {
		return []models.Role{}, err
	}
	roles := converters.NewRoleConverter().FromRecordsToModels(items)
	return roles, nil
}
