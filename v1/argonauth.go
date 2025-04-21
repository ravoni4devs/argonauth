package argonauth

import (
	"log"
	"net/http"
	"sync"

	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/pkg/config"
	"github.com/ravoni4devs/argonauth/v1/pkg/datastores"
	"github.com/ravoni4devs/argonauth/v1/pkg/handlers"
	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
	"github.com/ravoni4devs/argonauth/v1/pkg/rbac"
	"github.com/ravoni4devs/argonauth/v1/pkg/repositories"
	"github.com/ravoni4devs/argonauth/v1/pkg/services"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
)

const (
	basePublicEndpoint  = "/argonauth/public"
	basePrivateEndpoint = "/argonauth/private"
)

type argonAuth struct {
	conf           *config.Config
	log            Logger
	accountHandler *handlers.AccountHandler
	userHandler    *handlers.UserHandler
	groupHandler   *handlers.GroupHandler
	roleHandler    *handlers.RoleHandler
	repos          types.RepositoryContainer
	accountService types.AccountService
	roleService    types.RoleService
	mu             sync.Mutex
}

func New(options ...Option) ArgonAuth {
	a := &argonAuth{
		conf: &config.Config{},
		log:  logger.Get(),
	}
	for _, opt := range options {
		if err := opt(a); err != nil {
			log.Fatalln(err)
		}
	}

	var ds = datastores.New(
		datastores.WithSqlite(a.conf.Storage),
	)
	var repos = repositories.NewRepositoryContainer(ds)
	a.repos = repos
	var handlerContainer = handlers.New(
		handlers.WithLogger(a.log),
		handlers.WithConfig(*a.conf),
		handlers.WithRepositoryContainer(repos),
	)
	a.accountHandler = handlerContainer.AccountHandler()
	a.userHandler = handlerContainer.UserHandler()
	a.groupHandler = handlerContainer.GroupHandler()
	var serviceParams = services.Params{
		Repos:  repos,
		Config: *a.conf,
	}
	a.accountService = services.NewAccountService(serviceParams)
	return a
}

func (aa *argonAuth) RegisterSetupHandlers(group *echo.Group) {
	var routers = RouterMap{
		"": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.accountHandler.Setup,
		},
	}
	aa.RegisterHandlers(group, routers)
}

func (aa *argonAuth) RegisterDefaultHandlers(e *echo.Echo) {
	var public = e.Group(basePublicEndpoint)
	var routers = RouterMap{
		"/account/register": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.accountHandler.Register,
		},
		"/account/prelogin": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.accountHandler.PreLogin,
		},
	}
	if aa.conf.EnableStatefulAuth {
		routers["/account/loginweb"] = Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.accountHandler.LoginWithCookie,
		}
	}
	if !aa.conf.DisableStatelessAuth {
		routers["/account/login"] = Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.accountHandler.Login,
		}
	}
	aa.RegisterHandlers(public, routers)

	var private = e.Group(basePrivateEndpoint)
	routers = RouterMap{
		"/user/search": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.userHandler.Search,
		},
		"/user/update/:id": Router{
			HttpMethod: http.MethodPut,
			Handler:    aa.userHandler.Update,
		},
		"/user/:id/membership": Router{
			HttpMethod: http.MethodPut,
			Handler:    aa.userHandler.SetMemberships,
		},
		"/user/me": Router{
			HttpMethod: http.MethodGet,
			Handler:    aa.userHandler.Whoami,
		},

		"/group/search": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.groupHandler.Search,
		},
		"/group/create": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.groupHandler.Create,
		},
		"/group/update/:id": Router{
			HttpMethod: http.MethodPut,
			Handler:    aa.groupHandler.Update,
		},
		"/group/remove/:id": Router{
			HttpMethod: http.MethodDelete,
			Handler:    aa.groupHandler.Remove,
		},
		"/group/:id/roles": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.groupHandler.AttachRoles,
		},
		"/group/:id/users": Router{
			HttpMethod: http.MethodGet,
			Handler:    aa.groupHandler.GetUsers,
		},

		"/role/search": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.roleHandler.Search,
		},
		"/role/create": Router{
			HttpMethod: http.MethodPost,
			Handler:    aa.roleHandler.Create,
		},
		"/role/update/:id": Router{
			HttpMethod: http.MethodPut,
			Handler:    aa.roleHandler.Update,
		},
		"/role/remove/:id": Router{
			HttpMethod: http.MethodDelete,
			Handler:    aa.roleHandler.Remove,
		},
		"/role/:id/groups": Router{
			HttpMethod: http.MethodGet,
			Handler:    aa.roleHandler.GetGroups,
		},
	}
	aa.RegisterHandlers(private, routers)
}

func (aa *argonAuth) UseDefaultJwtCookieMiddleware(e *echo.Echo) {
	if aa.conf.EnableStatefulAuth {
		e.Group(basePrivateEndpoint, aa.accountHandler.VerifyTokenInCookie)
	}
	if !aa.conf.DisableStatelessAuth {
		e.Group(basePrivateEndpoint, aa.accountHandler.VerifyTokenInHeader)
	}
}

func (aa *argonAuth) UseDefaultRbacMiddleware(e *echo.Echo) {
	e.Group(basePrivateEndpoint, rbac.RoleMiddlewareWithConfig(rbac.RoleMiddlewareConfig{
		Mandatory: []rbac.Action{rbac.Management},
	}))
}

func (aa *argonAuth) RegisterHandlers(group *echo.Group, routers RouterMap) {
	for path, router := range routers {
		group.Add(router.HttpMethod, path, router.Handler)
	}
}

func (aa *argonAuth) Account(input ...types.AccountService) types.AccountService {
	aa.mu.Lock()
	defer aa.mu.Unlock()
	if len(input) > 0 {
		aa.accountService = input[0]
	}
	return aa.accountService
}

func (aa *argonAuth) SetupHandler(c echo.Context) error {
	return aa.accountHandler.SetupFunc(c)
}
