package argonauth

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/ravoni4devs/argonauth/v1/internal/config"
	"github.com/ravoni4devs/argonauth/v1/internal/datastores"
	"github.com/ravoni4devs/argonauth/v1/internal/handlers"
	"github.com/ravoni4devs/argonauth/v1/internal/logger"
	"github.com/ravoni4devs/argonauth/v1/internal/repositories"
	"github.com/ravoni4devs/argonauth/v1/pkg/rbac"
)

const (
	basePublicEndpoint = "/argonauth/public"
	basePrivateEndpoint = "/argonauth/private"
)

type Config struct {
	config.Config
}

type Logger interface {
	logger.Logger
}

type ArgonAuth struct {
	conf           Config
	log            Logger
	accountHandler *handlers.AccountHandler
	userHandler    *handlers.UserHandler
	groupHandler   *handlers.GroupHandler
	roleHandler    *handlers.RoleHandler
}

type Option func(*ArgonAuth) error

func WithLogger(log Logger) Option {
	return func(a *ArgonAuth) error {
		a.log = log
		return nil
	}
}

func New(config Config, options ...Option) *ArgonAuth {
	a := &ArgonAuth{
		conf: config,
		log: logger.Get(),
	}
	for _, opt := range options {
		if err := opt(a); err != nil {
			return nil
		}
	}

	var ds = datastores.New(
		datastores.WithSqlite(a.conf.Storage),
	)
	var repos = repositories.NewRepositoryContainer(ds)
	var handlerContainer = handlers.New(
		handlers.WithLogger(a.log),
		handlers.WithConfig(a.conf.Config),
		handlers.WithRepositoryContainer(repos),
	)
	a.accountHandler = handlerContainer.AccountHandler()
	a.userHandler = handlerContainer.UserHandler()
	a.groupHandler = handlerContainer.GroupHandler()
	return a
}

func (aa *ArgonAuth) RegisterSetupHandlers(group *echo.Group) {
	var routers = RouterMap{
		"": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.accountHandler.Setup,
		},
	}
	aa.RegisterHandlers(group, routers)
}

func (aa *ArgonAuth) RegisterDefaultHandlers(e *echo.Echo) {
	var public = e.Group(basePublicEndpoint)
	var routers = RouterMap{
		"/account/register": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.accountHandler.Register,
		},
		"/account/prelogin": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.accountHandler.PreLogin,
		},
	}
	if aa.conf.Config.EnableStatefulAuth {
		routers["/account/loginweb"] = Router{
			HttpMethod: http.MethodPost,
			Handler: aa.accountHandler.LoginWithCookie,
		}
	}
	if !aa.conf.Config.DisableStatelessAuth {
		routers["/account/login"] = Router{
			HttpMethod: http.MethodPost,
			Handler: aa.accountHandler.Login,
		}
	}
	aa.RegisterHandlers(public, routers)

	var private = e.Group(basePrivateEndpoint)
	routers = RouterMap{
		"/user/search": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.userHandler.Search,
		},
		"/user/update/:id": Router{
			HttpMethod: http.MethodPut,
			Handler: aa.userHandler.Update,
		},
		"/user/:id/membership": Router{
			HttpMethod: http.MethodPut,
			Handler: aa.userHandler.SetMemberships,
		},
		"/user/me": Router{
			HttpMethod: http.MethodGet,
			Handler: aa.userHandler.Whoami,
		},

		"/group/search": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.groupHandler.Search,
		},
		"/group/create": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.groupHandler.Create,
		},
		"/group/update/:id": Router{
			HttpMethod: http.MethodPut,
			Handler: aa.groupHandler.Update,
		},
		"/group/remove/:id": Router{
			HttpMethod: http.MethodDelete,
			Handler: aa.groupHandler.Remove,
		},
		"/group/:id/roles": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.groupHandler.AttachRoles,
		},
		"/group/:id/users": Router{
			HttpMethod: http.MethodGet,
			Handler: aa.groupHandler.GetUsers,
		},

		"/role/search": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.roleHandler.Search,
		},
		"/role/create": Router{
			HttpMethod: http.MethodPost,
			Handler: aa.roleHandler.Create,
		},
		"/role/update/:id": Router{
			HttpMethod: http.MethodPut,
			Handler: aa.roleHandler.Update,
		},
		"/role/remove/:id": Router{
			HttpMethod: http.MethodDelete,
			Handler: aa.roleHandler.Remove,
		},
		"/role/:id/groups": Router{
			HttpMethod: http.MethodGet,
			Handler: aa.roleHandler.GetGroups,
		},
	}
	aa.RegisterHandlers(private, routers)
}

func (aa *ArgonAuth) UseDefaultJwtCookieMiddleware(e *echo.Echo) {
	if aa.conf.EnableStatefulAuth {
		e.Group(basePrivateEndpoint, aa.accountHandler.VerifyTokenInCookie)
	}
	if !aa.conf.DisableStatelessAuth {
		e.Group(basePrivateEndpoint, aa.accountHandler.VerifyTokenInHeader)
	}
}

func (aa *ArgonAuth) UseDefaultRbacMiddleware(e *echo.Echo) {
	e.Group(basePrivateEndpoint, rbac.RoleMiddlewareWithConfig(rbac.RoleMiddlewareConfig{
		Mandatory: []rbac.Action{rbac.Management},
	}))
}

func (aa *ArgonAuth) RegisterHandlers(group *echo.Group, routers RouterMap) {
	for path, router := range routers {
		group.Add(router.HttpMethod, path, router.Handler)
	}
}
