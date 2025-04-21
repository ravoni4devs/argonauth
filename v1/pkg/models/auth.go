package models

import (
	"encoding/json"

	"github.com/ravoni4devs/argonauth/v1/pkg/types/customdate"
)

type User struct {
	ID       string
	Name     string
	Email    string
	Avatar   string
	Password string
	Salt     string
	Blocked  bool
	// PrivateKey string
	// PublicKey  string
	Groups []Group
}

func (a *User) Roles() string {
	var allRoles []map[string]any
	for _, group := range a.Groups {
		for _, role := range group.Roles {
			var perms []map[string]any
			json.Unmarshal([]byte(role.Permissions), &perms)
			r := map[string]any{
				"name":        role.Name,
				"permissions": perms,
			}
			allRoles = append(allRoles, r)
		}
	}
	b, _ := json.Marshal(allRoles)
	return string(b)
}

type Group struct {
	ID        uint64
	Name      string
	Roles     []Role
	System    bool
	CreatedAt customdate.CustomDate
}

type Role struct {
	ID          uint64
	Name        string
	Permissions string
	System      bool
	CreatedAt   customdate.CustomDate
}
