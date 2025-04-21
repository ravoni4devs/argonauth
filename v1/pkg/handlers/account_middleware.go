package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"

	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/customerror"
)

func (h *AccountHandler) VerifyTokenInCookie(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var res = dto.NewHttpResponse()
		cookie, err := c.Cookie(h.conf.GetCookieName())
		if err != nil {
			if err == http.ErrNoCookie {
				return c.JSON(http.StatusUnauthorized, res.Fail(errors.New("Missing or invalid token")))
			}
			return c.JSON(http.StatusBadRequest, res.Fail(err))
		}
		return h.parseTokenAndCacheUserData(next, c, cookie.Value)
	}
}

func (h *AccountHandler) VerifyTokenInHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var res = dto.NewHttpResponse()
		token, err := h.extractTokenFromHeader(c)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, res.Fail(errors.New("Missing or invalid token")))
		}
		return h.parseTokenAndCacheUserData(next, c, token)
	}
}

func (h *AccountHandler) extractTokenFromHeader(c echo.Context) (string, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return "", customerror.InvalidInput(nil, "missing Authorization header")
	}
	bearerToken := strings.Split(authHeader, "Bearer ")
	if len(bearerToken) != 2 {
		return "", customerror.InvalidInput(nil, "no token found in Authorization header")
	}
	return bearerToken[1], nil
}

func (h *AccountHandler) parseTokenAndCacheUserData(next echo.HandlerFunc, c echo.Context, token string) error {
	var res = dto.NewHttpResponse()
	id, err := h.jwtManager.ParseToken(token)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, res.Fail(errors.New("Invalid token")))
	}
	user, err := h.cacheIt(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusPreconditionRequired, res.Fail(errors.New("User not found")))
	}
	c.Set(h.conf.GetUserKey(), id)
	c.Set(h.conf.GetRolesKey(), user.Roles())
	return next(c)
}
