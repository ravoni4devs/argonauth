package sql

import (
	"fmt"
	"math"
	"strings"
)

const (
	postgres = "postgres"
	mysql    = "mysql"
	sqlite   = "sqlite"
)

type SqlBuilder struct {
	joins        []string
	statements   []string
	placeholders []interface{}
	page         int
	perPage      int
	orderBy      string
	db           string
}

type clause struct {
	statement   string
	placeholder interface{}
	hasJoin     bool
}

func NewSqlBuilder() *SqlBuilder {
	return NewPostgresSqlBuilder()
}

func NewPostgresSqlBuilder() *SqlBuilder {
	return &SqlBuilder{db: postgres}
}

func NewMysqlSqlBuilder() *SqlBuilder {
	return &SqlBuilder{db: mysql}
}

func NewSqliteSqlBuilder() *SqlBuilder {
	return &SqlBuilder{db: sqlite}
}

func (sb *SqlBuilder) Query() string {
	return sb.BuildWhereQuery() + sb.BuildOrderByQuery() + sb.BuildPaginationQuery()
}

func (sb *SqlBuilder) BuildPaginationQuery() string {
	return fmt.Sprintf(" LIMIT %d OFFSET %d", sb.perPage, sb.page)
}

func (sb *SqlBuilder) BuildOrderByQuery() string {
	return sb.orderBy
}

func (sb *SqlBuilder) OrderBy(conditions ...clause) *SqlBuilder {
	if len(conditions) == 0 {
		return sb
	}
	query := " ORDER BY "
	for _, cond := range conditions {
		query += cond.statement + ", "
	}
	sb.orderBy = query[:len(query)-2]
	return sb
}

func (sb *SqlBuilder) AscOrder(field string) clause {
	return clause{
		statement: removeDangerousChars(field) + " ASC",
	}
}

func (sb *SqlBuilder) DescOrder(field string) clause {
	return clause{
		statement: removeDangerousChars(field) + " DESC",
	}
}

func (sb *SqlBuilder) BuildWhereQuery() string {
	totalStatements := len(sb.statements)
	totalJoins := len(sb.joins)
	if (totalStatements == 0 || len(sb.placeholders) == 0) && totalJoins == 0 {
		return ""
	}
	query := " WHERE 1=1"
	for i := 0; i < totalJoins; i++ {
		query += sb.joins[i]
	}
	for i := 0; i < totalStatements; i++ {
		placeholder := "?"
		if sb.db == postgres {
			placeholder = fmt.Sprintf("$%d", i+1)
		}
		query += sb.statements[i] + placeholder
	}
	return query
}

func (sb *SqlBuilder) Where(conditions ...clause) *SqlBuilder {
	if len(conditions) == 0 {
		return sb
	}
	for _, cond := range conditions {
		if cond.hasJoin {
			sb.joins = append(sb.joins, cond.statement)
			continue
		}
		sb.statements = append(sb.statements, cond.statement)
		sb.placeholders = append(sb.placeholders, cond.placeholder)
	}
	return sb
}

func (sb *SqlBuilder) Join(conditions ...clause) clause {
	var statements string
	for _, cond := range conditions {
		statements += fmt.Sprintf("%s%s", cond.statement, cond.placeholder)
	}
	return clause{
		statement: statements,
		hasJoin:   true,
	}
}

func (sb *SqlBuilder) OrWhere(field, operator string, value interface{}) clause {
	return clause{
		statement:   " OR " + removeDangerousChars(field) + " " + operator + " ",
		placeholder: value,
	}
}

func (sb *SqlBuilder) AndWhere(field, operator string, value interface{}) clause {
	return clause{
		statement:   " AND " + removeDangerousChars(field) + " " + operator + " ",
		placeholder: value,
	}
}

func (sb *SqlBuilder) WhereValues() []interface{} {
	return sb.placeholders
}

// Sugar syntax to Paginate
func (sb *SqlBuilder) Limit(page, perPage int) *SqlBuilder {
	return sb.Paginate(page, perPage)
}

func (sb *SqlBuilder) Paginate(page, perPage int) *SqlBuilder {
	p := int(math.Max(1, float64(page)))
	offset := (p - 1) * int(perPage)
	sb.page = offset
	sb.perPage = perPage
	return sb
}

func removeDangerousChars(str string) string {
	s := strings.ReplaceAll(str, "\xbf\x27", "")
	s = strings.ReplaceAll(s, "'", "")
	s = strings.ReplaceAll(s, "\"", "")
	s = strings.ReplaceAll(s, ";", "")
	return s
}
