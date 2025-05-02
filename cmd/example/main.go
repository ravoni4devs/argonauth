package main

import (
	"bytes"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"strings"
	"text/template"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/ravoni4devs/argonauth/v1"
)

type WebPage struct {
	webFS embed.FS
}

//go:embed web
var webFS embed.FS

//go:embed web/static
var staticFS embed.FS

func main() {
	var e = getHttpServer()

	var auth = argonauth.New(
		argonauth.EnableStatefulAuth(),
		argonauth.UseCache(),
		argonauth.EnableDebug(),
		argonauth.SetSqlite("database.db"),
		argonauth.SetGroupOptions(argonauth.GroupOptions{
			DefaultGroupName:      "Guests",
			DefaultAdminGroupName: "Authors",
		}),
		argonauth.SetTokenOptions(argonauth.TokenOptions{
			Secret:     "123456",
			Expiration: time.Minute * 60,
			Audience:   "myapp",
			Issuer:     "myproject",
		}),
	)
	configureRouter(e, auth)
	configureSetup(e, auth)

	log.Fatal(e.Start(":9001"))
}

func configureSetup(e *echo.Echo, auth argonauth.ArgonAuth) {
	e.GET("/setup", func(c echo.Context) error {
		return c.Redirect(http.StatusTemporaryRedirect, "/web/setup.html")
	})

	var webPage = NewWebPage()
	static := "/web/static/"
	e.GET(static+"*", echo.WrapHandler(http.StripPrefix(static, webPage.GetStaticFS())))

	auth.RegisterSetupHandlers(e.Group("/web/setup/finish"))

	e.GET("/web", func(c echo.Context) error {
		return c.Redirect(307, "web/index.html")
	})
	e.GET("/web/:filename", func(c echo.Context) error {
		filename := c.Param("filename")
		if !strings.HasSuffix(filename, ".html") {
			filename = filename + ".html"
		}
		content, _ := webPage.Lookup(filename)
		if content == "" {
			return c.String(http.StatusNotFound, fmt.Sprintf("Not found: %s\n", filename))
		}
		c.Response().Header().Set("Expires", time.Unix(0, 0).Format(time.RFC1123))
		c.Response().Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
		c.Response().Header().Set("Pragma", "no-cache")
		c.Response().Header().Set("X-Accel-Expic.Response()", "0")

		t, err := template.New("").Parse(content)
		if err != nil {
			return c.HTML(http.StatusInternalServerError, err.Error())
		}
		var templateData = ""
		var csrf = c.Get("csrf")
		if csrf != nil {
			templateData = c.Get("csrf").(string)
		}
		var b bytes.Buffer
		err = t.Execute(&b, map[string]any{
			"csrf": templateData,
		})
		if err != nil {
			return c.HTML(http.StatusInternalServerError, err.Error())
		}
		return c.HTML(http.StatusOK, b.String())
	})
}

func configureRouter(e *echo.Echo, auth argonauth.ArgonAuth) {
	privateRouter := e.Group("/api/private")
	privateRouter.Use(auth.VerifyTokenInHeaderMiddleware())
	auth.RegisterDefaultPrivateHandlers(privateRouter)

	publicRouter := e.Group("/api/public")
	auth.RegisterDefaultPublicHandlers(publicRouter)
}

func getHttpServer() *echo.Echo {
	e := echo.New()
	e.Debug = false
	e.HideBanner = true
	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLength:    32,
		TokenLookup:    "header:" + echo.HeaderXCSRFToken,
		ContextKey:     "csrf",
		CookieName:     "_csrf",
		CookiePath:     "/",
		CookieSameSite: http.SameSiteLaxMode,
		CookieMaxAge:   3600,
		Skipper: func(c echo.Context) bool {
			var path = c.Request().URL.Path
			isAssets := strings.Contains(path, "/web/assets")
			return isAssets
		},
	}))
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
		AllowMethods: []string{
			http.MethodOptions,
			http.MethodGet,
			http.MethodPut,
			http.MethodPatch,
			http.MethodPost,
			http.MethodDelete,
			http.MethodHead,
		},
	}))
	e.Use(middleware.BodyLimit("10M"))
	e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Level: 5,
	}))
	return e
}

func NewWebPage() WebPage {
	return WebPage{webFS}
}

func (w WebPage) GetFS() fs.FS {
	files, _ := fs.Sub(w.webFS, "web")
	return files
}

func (w WebPage) GetStaticFS() http.Handler {
	files, _ := fs.Sub(staticFS, "web/static")
	httpFS := http.FS(files)
	return http.FileServer(httpFS)
}

func (w WebPage) Lookup(filename string) (string, error) {
	var content []byte
	err := fs.WalkDir(w.GetFS(), ".", func(s string, d fs.DirEntry, e error) error {
		if e != nil {
			return e
		}
		if !d.IsDir() {
			if s == filename {
				b, err := w.webFS.ReadFile("web" + "/" + s)
				if err != nil {
					return err
				}
				content = b
			}
		}
		return nil
	})
	return string(content), err
}
