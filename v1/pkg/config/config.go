package config

import "time"

type Config struct {
	Storage               string
	UseCache              bool
	Debug                 bool
	TokenSecret           string
	TokenAudience         string
	TokenIssuer           string
	TokenExpiration       time.Duration
	CookieName            string
	EnableStatefulAuth    bool
	DisableStatelessAuth  bool
	DefaultGroupName      string
	DefaultAdminGroupName string
	ReturnUserRoles       bool
}

func (c Config) GetCookieName() string {
	if c.CookieName != "" {
		return c.CookieName
	}
	return "argonauth"
}

func (c Config) GetRolesKey() string {
	return "roles"
}

func (c Config) GetUserKey() string {
	return "user"
}

func (c Config) GetDefaultGroupName() string {
	if c.DefaultGroupName != "" {
		return c.DefaultGroupName
	}
	return "Users"
}

func (c Config) GetDefaultAdminGroupName() string {
	if c.DefaultAdminGroupName != "" {
		return c.DefaultAdminGroupName
	}
	return "Admins"
}
