package converters

import (
	"strings"

	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/sql"
)

type SearchConverter struct{}

func NewSearchConverter() SearchConverter {
	return SearchConverter{}
}

func (c SearchConverter) FromRequestToSqlBuilder(input dto.SearchRequest) *sql.SqlBuilder {
	sb := sql.NewSqliteSqlBuilder()
	order := sb.AscOrder(input.OrderBy)
	if strings.ToLower(input.Sort) == "desc" {
		order = sb.DescOrder(input.OrderBy)
	}
	sb.OrderBy(order).Paginate(input.Page, input.PerPage)
	return sb
}
