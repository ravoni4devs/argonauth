package rbac

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

type httpResponse struct {
	Error struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func (r *httpResponse) Fail(err error) *httpResponse {
	r.Error.Message = err.Error()
	return r
}

var httpMethods = map[string]Action{
	"get":    Read,
	"post":   Create,
	"put":    Update,
	"patch":  Update,
	"delete": Delete,
}

type RoleMiddlewareConfig struct {
	Skipper   func(c echo.Context) bool
	Mandatory []Action
}

func RoleMiddleware() echo.MiddlewareFunc {
	return RoleMiddlewareWithConfig(RoleMiddlewareConfig{
		Skipper: func(c echo.Context) bool {
			return false
		},
	})
}

func RoleMiddlewareWithConfig(config RoleMiddlewareConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if config.Skipper != nil && config.Skipper(c) {
				return next(c)
			}

			var res = &httpResponse{}
			roles, ok := c.Get("roles").(string)
			if !ok {
				return c.JSON(http.StatusForbidden, res.Fail(errors.New("roles not found")))
			}
			path := c.Path()
			parts := strings.Split(path, "/")
			lastPart := len(parts) - 1
			target := parts[lastPart]
			if target == "search" {
				target = parts[lastPart-1]
			}

			method := strings.ToLower(c.Request().Method)
			action, ok := httpMethods[method]
			if !ok {
				return c.JSON(http.StatusBadRequest, res.Fail(fmt.Errorf("not acceptable HTTP verb %s", method)))
			}
			if strings.Contains(path, "/search") {
				action = Read
			}

			for _, mandatoryAction := range config.Mandatory {
				if can := WithRoles(roles).HasPermission(mandatoryAction, target); !can {
					return c.JSON(http.StatusForbidden, res.Fail(errors.New("you do not have a required role")))
				}
			}
			if can := WithRoles(roles).HasPermission(action, target); !can {
				return c.JSON(http.StatusForbidden, res.Fail(errors.New("insufficient permission")))
			}
			return next(c)
		}
	}
}
