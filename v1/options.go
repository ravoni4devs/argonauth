package argonauth

import (
	"errors"
	"time"
)

type Option func(*argonAuth) error

type TokenOptions struct {
	Secret     string
	Audience   string
	Expiration time.Duration
	Issuer     string
}

type GroupOptions struct {
	DefaultGroupName      string
	DefaultAdminGroupName string
}

func WithLogger(input Logger) Option {
	return func(a *argonAuth) error {
		a.log = input
		return nil
	}
}

func SetSqlite(input string) Option {
	return func(a *argonAuth) error {
		if input == "" {
			input = ":memory:"
		}
		a.conf.Storage = input
		return nil
	}
}

func UseCache() Option {
	return func(a *argonAuth) error {
		a.conf.UseCache = true
		return nil
	}
}

func EnableDebug() Option {
	return SetDebug(true)
}

func SetDebug(input bool) Option {
	return func(a *argonAuth) error {
		a.conf.Debug = input
		return nil
	}
}

func EnableStatefulAuth() Option {
	return func(a *argonAuth) error {
		a.conf.EnableStatefulAuth = true
		return nil
	}
}


func EnableUserRolesInResponse() Option {
	return func(a *argonAuth) error {
		a.conf.ReturnUserRoles = true
		return nil
	}
}

func DisableStatelessAuth() Option {
	return func(a *argonAuth) error {
		a.conf.DisableStatelessAuth = false
		return nil
	}
}

func SetTokenOptions(input TokenOptions) Option {
	return func(a *argonAuth) error {
		if input.Audience == "" {
			input.Audience = "web"
		}
		a.conf.TokenAudience = input.Audience
		if input.Secret == "" {
			return errors.New("empty jwt secret")
		}
		a.conf.TokenSecret = input.Secret
		if input.Expiration.Seconds() < 1 {
			input.Expiration = time.Hour * 48
		}
		a.conf.TokenExpiration = input.Expiration
		if input.Issuer == "" {
			input.Issuer = "ArgonAuth"
		}
		a.conf.TokenIssuer = input.Issuer
		return nil
	}
}

func SetGroupOptions(input GroupOptions) Option {
	return func(a *argonAuth) error {
		if input.DefaultAdminGroupName == "" {
			input.DefaultAdminGroupName = "Admins"
		}
		a.conf.DefaultAdminGroupName = input.DefaultAdminGroupName
		if input.DefaultGroupName == "" {
			input.DefaultGroupName = "Users"
		}
		a.conf.DefaultGroupName = input.DefaultGroupName
		return nil
	}
}
