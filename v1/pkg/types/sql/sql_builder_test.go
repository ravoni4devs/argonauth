package sql_test

import (
	"fmt"
	"testing"

	"github.com/ravoni4devs/argonauth/v1/pkg/types/sql"
)

func TestSearchBuilder(t *testing.T) {
	builder := sql.NewPostgresSqlBuilder()
	builder.Where(
		builder.AndWhere("id", "=", "123"),
		builder.AndWhere("created_at", ">=", "current_timestramp"),
		builder.OrWhere("email", "like", "%@gmail"),
	).OrderBy(
		builder.AscOrder("id"),
		builder.DescOrder("created_at"),
	).Limit(1, 10)

	where := builder.BuildWhereQuery()
	assertEqual(t, where, " WHERE 1=1 AND id = $1 AND created_at >= $2 OR email like $3")

	totalPlaceholders := len(builder.WhereValues())
	assertEqual(t, totalPlaceholders, 3)

	pagination := builder.BuildPaginationQuery()
	assertEqual(t, pagination, " LIMIT 10 OFFSET 0")

	orderBy := builder.BuildOrderByQuery()
	assertEqual(t, orderBy, " ORDER BY id ASC, created_at DESC")

	query := builder.Query()
	assertEqual(t, query, " WHERE 1=1 AND id = $1 AND created_at >= $2 OR email like $3 ORDER BY id ASC, created_at DESC LIMIT 10 OFFSET 0")
}

func TestSearchBuilderUsingJoin(t *testing.T) {
	builder := sql.NewPostgresSqlBuilder()
	builder.Where(
		builder.Join(
			builder.AndWhere("u.id", "=", "m.user_id"),
			builder.AndWhere("g.id", "=", "m.group_id"),
		),
		builder.AndWhere("u.is_active", "=", true),
		builder.AndWhere("g.name", "=", "mygroup"),
		builder.AndWhere("u.name", "ilike", "gustavo"),
		builder.OrWhere("u.email", "ilike", "gustavo"),
	).OrderBy(
		builder.AscOrder("u.name"),
		builder.DescOrder("created_at"),
	).Limit(1, 10)

	want := " WHERE 1=1 AND u.id = m.user_id AND g.id = m.group_id AND u.is_active = $1 AND g.name = $2 AND u.name ilike $3 OR u.email ilike $4"
	got := builder.BuildWhereQuery()
	assertEqual(t, got, want)

	totalPlaceholders := len(builder.WhereValues())
	assertEqual(t, totalPlaceholders, 4)
}

func assertEqual(t *testing.T, got, want any) {
	if got != want {
		t.Fatal(fmt.Sprintf("\n\t got=%s\n\twant=%s", got, want))
	}
}
