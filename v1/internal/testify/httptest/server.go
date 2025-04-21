package httptest

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/http/httptest"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type HttpServerTest struct {
	router *echo.Echo
}

func OnGET(url string, fn echo.HandlerFunc) *HttpServerTest {
	router := getHttpServer()
	router.GET(url, fn)
	return &HttpServerTest{
		router: router,
	}
}

func OnPOST(url string, fn echo.HandlerFunc) *HttpServerTest {
	router := getHttpServer()
	router.POST(url, fn)
	return &HttpServerTest{
		router: router,
	}
}

func OnPUT(url string, fn echo.HandlerFunc) *HttpServerTest {
	router := getHttpServer()
	router.PUT(url, fn)
	return &HttpServerTest{
		router: router,
	}
}

func OnPATCH(url string, fn echo.HandlerFunc) *HttpServerTest {
	router := getHttpServer()
	router.PATCH(url, fn)
	return &HttpServerTest{
		router: router,
	}
}

func OnDELETE(url string, fn echo.HandlerFunc) *HttpServerTest {
	router := getHttpServer()
	router.DELETE(url, fn)
	return &HttpServerTest{
		router: router,
	}
}

func (h HttpServerTest) ServeHTTP(req *http.Request, data any) (*http.Response, error) {
	var rec = httptest.NewRecorder()
	var isPathRegistered = false

	h.router.ServeHTTP(rec, req)
	c := h.router.NewContext(req, rec).(echo.Context)
	if c == nil {
		log.Fatalln("failed to create httptest context for", req.URL.Path)
	}
	h.router.Router().Find(req.Method, req.URL.Path, c)
	c.Handler()
	for _, r := range h.router.Routes() {
		if r.Path == c.Path() {
			isPathRegistered = true
		}
	}
	if !isPathRegistered {
		log.Fatalln("the request path", req.URL.Path, "is not a registered route")
	}
	rawResponse := rec.Result()
	body, err := io.ReadAll(rawResponse.Body)
	if err != nil {
		panic(err)
	}
	err = json.Unmarshal(body, data)
	return rawResponse, err
}

func (h *HttpServerTest) Use(mid echo.MiddlewareFunc) *HttpServerTest {
	h.router.Use(mid)
	return h
}

func getHttpServer() *echo.Echo {
	e := echo.New()
	e.Debug = false
	e.HideBanner = true
	e.Pre(middleware.RemoveTrailingSlash())
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
