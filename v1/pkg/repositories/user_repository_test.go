package repositories_test

import (
	"context"
	"fmt"
	"testing"

	"github.com/ravoni4devs/argonauth/v1/internal/stringfy/random"
	"github.com/ravoni4devs/argonauth/v1/internal/testify"
	"github.com/ravoni4devs/argonauth/v1/internal/testify/assert"
	db "github.com/ravoni4devs/argonauth/v1/pkg/datastores"
	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/repositories"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/sql"
	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid"
)

func TestUserRepository(tt *testing.T) {
	var admins = models.Group{ID: 1, Name: "admins"}
	var insertFakeData = func(store db.SqlDataStore) {
		q := "insert into users (id, name, email, password, salt, blocked) values ($1, $2, $3, $4, $5, $6)"
		generator := uniqid.New()
		store.Exec(q, "1", "Gustavo", "gustavo@mail.com", "xxxx", "xxxx", true)
		for i := 0; i < 20; i++ {
			id := generator.ID()
			name := random.EightNumbers()
			salt := random.EightNumbers()
			password := random.SixNumbers()
			email := fmt.Sprintf("%s@gmail.com", name)
			isActive := true
			if i%2 == 0 {
				isActive = false
			}
			store.Exec(q, id, name, email, password, salt, isActive)
		}
		role := models.Role{ID: 1, Name: "Admin", Permissions: `[{"action": "admin", "target": "*"}]`}
		store.Exec("insert into groups (id, name) values ($1, $2)", admins.ID, admins.Name)
		store.Exec("insert into roles (id, name, permissions) values ($1, $2, $3)", role.ID, role.Name, role.Permissions)
		store.Exec("insert into group_roles (group_id, role_id) values ($1, $2)", admins.ID, role.ID)
	}
	var ctx = context.Background()

	testify.It(tt, "Create", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should create user", func(t *testing.T, store db.SqlDataStore) {
			repo := repositories.NewUserRepository(store)
			item := models.User{}
			item.ID = "12345"
			item.Name = "someone"
			item.Email = "me@gmail.com"
			item.Password = "xxxxxxx"
			_, err := repo.Create(ctx, item)
			assert.Nil(t, err, "create error", fmt.Sprintf("%s", err))

			var user dto.UserTable
			q := "select id, name, email, avatar, password from users where id=$1"
			err = store.WithContext(ctx).QueryOne(q, &user, item.ID)
			assert.Nil(t, err, fmt.Sprintf("select from users: %s", err))
			assert.Equal(t, user.Password, item.Password)
			assert.Equal(t, user.Name, item.Name)
			assert.Equal(t, user.Email, item.Email)
		})
	})

	testify.It(tt, "AddMembership", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should insert membership", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewUserRepository(store)
			user := models.User{ID: "1"}
			err := repo.AddMembership(ctx, user, admins)
			assert.Nil(t, err, fmt.Sprintf("%s", err))

			var groupID uint64
			store.QueryOne("select group_id from memberships where user_id=$1", &groupID, user.ID)
			assert.Equal(t, groupID, admins.ID)
		})
	})

	testify.It(tt, "Search", func(ts *testing.T) {
		db.SqliteSeed(ts, "Should return nothing when pagination is not defined", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewUserRepository(store)
			sb := sql.NewSqliteSqlBuilder()
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 0)
		})
		db.SqliteSeed(ts, "Should return paginated records", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewUserRepository(store)
			sb := sql.NewSqliteSqlBuilder().Paginate(1, 5)
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 5)
		})
		db.SqliteSeed(ts, "Should return only unblocked", func(t *testing.T, store db.SqlDataStore) {
			insertFakeData(store)
			repo := repositories.NewUserRepository(store)
			sb := sql.NewSqliteSqlBuilder()
			sb.Where(
				sb.AndWhere("blocked", "=", false),
			).Paginate(1, 5)
			found, err := repo.Search(ctx, sb)
			assert.Nil(t, err, "search error", fmt.Sprintf("%s", err))
			assert.Equal(t, len(found), 5)
			for _, user := range found {
				assert.False(t, user.Blocked)
			}
		})
	})
}
