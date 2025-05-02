package argonauth

import (
	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
)

type Logger interface {
	logger.Logger
}

type ArgonAuth interface {
	RegisterSetupHandlers(group *echo.Group)
	RegisterDefaultPublicHandlers(group *echo.Group)
	RegisterDefaultPrivateHandlers(group *echo.Group)
	RegisterHandlers(group *echo.Group, router RouterMap)
	Account(input ...types.AccountService) types.AccountService
	SetupHandler(c echo.Context) error
	VerifyTokenInCookieMiddleware() func(echo.HandlerFunc) echo.HandlerFunc
	VerifyTokenInHeaderMiddleware() func(echo.HandlerFunc) echo.HandlerFunc
	VerifyRolesMiddleware() func(echo.HandlerFunc) echo.HandlerFunc
}
