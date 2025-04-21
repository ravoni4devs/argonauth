package argonauth

import "github.com/labstack/echo/v4"

type Router struct {
	Handler    func(echo.Context) error
	HttpMethod string
}

type RouterMap map[string]Router
