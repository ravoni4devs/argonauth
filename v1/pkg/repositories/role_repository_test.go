package repositories_test

import (
	"context"
	"fmt"
	"testing"

	db "github.com/ravoni4devs/argonauth/v1/pkg/datastores"
	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/repositories"
	"github.com/ravoni4devs/argonauth/v1/internal/stringfy/random"
	"github.com/ravoni4devs/argonauth/v1/internal/testify"
	"github.com/ravoni4devs/argonauth/v1/internal/testify/assert"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/sql"
	"github.com/ravoni4devs/argonauth/v1/pkg/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid"
)

func TestRoleRepository(tt *testing.T) {
	var admins = models.Group{ID: 1, Name: "admins", System: true}
	var insertFakeData = func(store db.SqlDataStore) {
		q := "insert into roles (id, name, permissions, system) values ($1, $2, $3, $4)"
		store.Exec(q, 1, "Admin", `[{"action": "admin", "target": "*"}]`, true)
		generator := uniqid.New()
		for i := 0; i < 20; i++ {
			id := generator.ID()
			name := random.EightNumbers()
			store.Exec(q, id, name, "[]", false)
		}
		store.Exec("insert into groups (id, name, system) values ($1, $2, $3)", admins.ID, admins.Name, admins.System)
	}
	var ctx = context.Background()

	testify.It(tt, "Create", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should insert role", func(t *testing.T, store db.SqlDataStore) {
			repo := repositories.NewRoleRepository(store)
			item := models.Role{}
			item.ID = 12345
			item.Name = "some role"
			item.Permissions = `[{"action":"read", "target": "user"}]`
			_, err := repo.Create(ctx, item)
			assert.Nil(t, err, "create error", fmt.Sprintf("%s", err))

			var role dto.RoleTable
			q := "select id, name from roles where id=$1"
			err = store.WithContext(ctx).QueryOne(q, &role, item.ID)
			assert.Nil(t, err, fmt.Sprintf("select from roles: %s", err))
			assert.Equal(t, role.Name, item.Name)
		})
	})

	testify.It(tt, "Search", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should return nothing when pagination is not defined", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewRoleRepository(store)
			sb := sql.NewSqliteSqlBuilder()
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 0)
		})
		db.SqliteSeed(ts, "Should return paginated records", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewRoleRepository(store)
			sb := sql.NewSqliteSqlBuilder().Paginate(1, 5)
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 5)
		})
		db.SqliteSeed(ts, "Should return only not actives", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewRoleRepository(store)
			sb := sql.NewSqliteSqlBuilder()
			sb.Where(
				sb.AndWhere("permissions", "<>", "[]"),
			).Paginate(1, 5)
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 1)
		})
	})

	testify.It(tt, "Remove", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should remove role and detach it from group", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			role := models.Role{ID: 1}
			err := store.Exec("insert into group_roles (group_id, role_id) values ($1, $2)", 1, role.ID)
			assert.Nil(t, err)
			err = store.Exec("update roles set system=$1 where id=$2", false, role.ID)
			assert.Nil(t, err)

			repo := repositories.NewRoleRepository(store)
			err = repo.Remove(ctx, role)
			assert.Nil(t, err)

			var found uint64
			err = store.QueryOne("select role_id from group_roles where role_id=1", &found)
			assert.NotNil(t, err, fmt.Sprintf("%s id=%d", err, found))
		})
		db.SqliteSeed(ts, "Should not remove system role", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			role := models.Role{ID: 1}
			err := store.Exec("insert into group_roles (group_id, role_id) values ($1, $2)", 1, role.ID)
			assert.Nil(t, err)

			repo := repositories.NewRoleRepository(store)
			err = repo.Remove(ctx, role)
			assert.NotNil(t, err)

			var found uint64
			store.QueryOne("select role_id from group_roles where role_id=1", &found)
			assert.Equal(t, found, role.ID)
		})
	})
}
