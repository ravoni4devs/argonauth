package argonauth

import (
	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
)

type Logger interface {
	logger.Logger
}

type ArgonAuth interface {
	RegisterSetupHandlers(group *echo.Group)
	RegisterDefaultHandlers(e *echo.Echo)
	UseDefaultJwtCookieMiddleware(e *echo.Echo)
	UseDefaultRbacMiddleware(e *echo.Echo)
	RegisterHandlers(group *echo.Group, routers RouterMap)
}
