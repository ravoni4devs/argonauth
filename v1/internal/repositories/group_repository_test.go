package repositories_test

import (
	"context"
	"fmt"
	"testing"

	db "github.com/ravoni4devs/argonauth/v1/internal/datastores"
	"github.com/ravoni4devs/argonauth/v1/internal/dto"
	"github.com/ravoni4devs/argonauth/v1/internal/repositories"
	"github.com/ravoni4devs/argonauth/v1/internal/stringfy/random"
	"github.com/ravoni4devs/argonauth/v1/internal/testify"
	"github.com/ravoni4devs/argonauth/v1/internal/testify/assert"
	"github.com/ravoni4devs/argonauth/v1/internal/types/sql"
	"github.com/ravoni4devs/argonauth/v1/internal/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid"
)

func TestGroupRepository(tt *testing.T) {
	var admins = models.Group{ID: 1, Name: "admins"}
	var insertFakeData = func(store db.SqlDataStore) {
		q := "insert into groups (id, name) values ($1, $2)"
		generator := uniqid.New()
		store.Exec(q, admins.ID, admins.Name)
		for i := 0; i < 20; i++ {
			id := generator.ID()
			name := random.EightNumbers()
			store.Exec(q, id, name)
		}
		role := models.Role{ID: 1, Name: "Admin", Permissions: `[{"action": "admin", "target": "*"}]`}
		store.Exec("insert into roles (id, name, permissions) values ($1, $2, $3)", role.ID, role.Name, role.Permissions)
		store.Exec("insert into group_roles (group_id, role_id) values ($1, $2)", admins.ID, role.ID)
	}

	var ctx = context.Background()

	testify.It(tt, "Create", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should insert group", func(t *testing.T, store db.SqlDataStore) {
			repo := repositories.NewGroupRepository(store)
			item := models.Group{}
			item.ID = 12345
			item.Name = "someone"
			_, err := repo.Create(ctx, item)
			assert.Nil(t, err, "create error", fmt.Sprintf("%s", err))

			var group dto.GroupTable
			q := "select id, name from groups where id=$1"
			err = store.WithContext(ctx).QueryOne(q, &group, item.ID)
			assert.Nil(t, err, fmt.Sprintf("select from groups: %s", err))
			assert.Equal(t, group.Name, item.Name)
		})
		db.SqliteSeed(ts, "Should fail when name is duplicated", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewGroupRepository(store)
			item := models.Group{}
			item.ID = 12345
			item.Name = "admins"
			_, err := repo.Create(ctx, item)
			assert.NotNil(t, err, fmt.Sprintf("%s", err))
		})
	})

	testify.It(tt, "Search", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should return nothing when pagination is not defined", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewGroupRepository(store)
			sb := sql.NewSqliteSqlBuilder()
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 0)
		})
		db.SqliteSeed(ts, "Should return paginated records", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewGroupRepository(store)
			sb := sql.NewSqliteSqlBuilder().Paginate(1, 5)
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 5)
		})
		db.SqliteSeed(ts, "Should return only not actives", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewGroupRepository(store)
			sb := sql.NewSqliteSqlBuilder()
			sb.Where(
				sb.AndWhere("name", "=", "admins"),
			).Paginate(1, 5)
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 1)
		})
	})

	testify.It(tt, "AttachRole", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should attach role", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			var roleID uint64 = 123
			store.Exec("insert into roles(id, name) values($1, $2)", roleID, "some role test")

			repo := repositories.NewGroupRepository(store)
			roles := []models.Role{{ID: roleID}}
			admins.Roles = roles
			err := repo.AttachRoles(ctx, admins)
			assert.Nil(t, err, fmt.Sprintf("%s", err))
		})
		db.SqliteSeed(ts, "Should fail when role doesnt exists", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewGroupRepository(store)
			admins.Roles = []models.Role{{ID: 1234567}}
			err := repo.AttachRoles(ctx, admins)
			assert.NotNil(t, err, fmt.Sprintf("%s", err))
		})
		db.SqliteSeed(ts, "Should delete and reinsert roles", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewGroupRepository(store)
			admins.Roles = []models.Role{{ID: 1}}
			err := repo.AttachRoles(ctx, admins)
			assert.Nil(t, err, fmt.Sprintf("%s", err))
			var found int
			store.QueryOne("select count(*) from group_roles where group_id=?", &found, admins.ID)
			assert.Equal(t, 1, found)
		})
	})
}
