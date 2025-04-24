package rbac_test

import (
	"testing"

	"github.com/ravoni4devs/argonauth/v1/pkg/rbac"
	"github.com/ravoni4devs/argonauth/v1/pkg/rbac/test/assert"
)

func TestHasPermissionReadOrder(t *testing.T) {
	rolesStr := `[{
        "name": "",
        "permissions": [{
            "action": "read",
            "target": "order"
        }]
    }]`
	roles, _ := rbac.FromJSON(rolesStr)
	hasPermission := rbac.With(roles).HasPermission(rbac.Read, "order")
	assert.True(t, hasPermission)
}

func TestHasPermissionAdminOrder(t *testing.T) {
	rolesStr := `[{
        "name": "",
        "permissions": [{
            "action": "admin",
            "target": "order"
        }]
    }]`
	roles, _ := rbac.FromJSON(rolesStr)
	hasPermission := rbac.With(roles).HasPermission(rbac.Read, "order")
	assert.True(t, hasPermission)
}

func TestHasPermissionCreateAnything(t *testing.T) {
	rolesStr := `[{
        "name": "",
        "permissions": [{
            "action": "create",
            "target": "*"
        }]
    }]`
	roles, _ := rbac.FromJSON(rolesStr)
	hasPermission := rbac.With(roles).HasPermission(rbac.Create, "order")
	assert.True(t, hasPermission)
}

func TestHasPermissionSuperAdmin(t *testing.T) {
	rolesStr := `[{
        "name": "",
        "permissions": [{
            "action": "admin",
            "target": "*"
        }]
    }]`
	roles, _ := rbac.FromJSON(rolesStr)
	hasPermission := rbac.With(roles).HasPermission(rbac.Create, "order")
	assert.True(t, hasPermission)
}

func TestHasPermissionDenied(t *testing.T) {
	rolesStr := `[{
        "name": "",
        "permissions": [{
            "action": "read",
            "target": "*"
        }]
    }]`
	roles, _ := rbac.FromJSON(rolesStr)
	hasPermission := rbac.With(roles).HasPermission(rbac.Create, "order")
	assert.False(t, hasPermission)
}

func TestHasMultiPermissions(t *testing.T) {
	rolesStr := `
- name:
  permissions:
  - action: read
    target: "*"
  - action: update
    target: order`
	roles, _ := rbac.FromYAML(rolesStr)
	hasPermission := rbac.With(roles).HasPermission(rbac.Update, "order")
	assert.True(t, hasPermission)
}

func TestIsAllowedUsingNumber(t *testing.T) {
	rolesStr := `
- name:
  permissions:
  - action: update
    target: "order"
    rules:
    - allowed: true
      key: amount
      operator: lte
      value: 1000`
	roles, _ := rbac.FromYAML(rolesStr)
	type Order struct {
		ProductName string `json:"product_name"`
		Amount      int    `json:"amount"`
	}
	order := Order{ProductName: "Notebook", Amount: 1000}
	isAllowed := rbac.With(roles).IsAllowed(order)
	assert.True(t, isAllowed)
}

func TestIsAllowedWithAllowedFalse(t *testing.T) {
	rolesStr := `
- name:
  permissions:
  - action: update
    target: "order"
    rules:
    - allowed: false
      key: amount
      operator: lte
      value: 1000`
	roles, _ := rbac.FromYAML(rolesStr)
	type Order struct {
		ProductName string `json:"product_name"`
		Amount      int    `json:"amount"`
	}
	order := Order{ProductName: "Notebook", Amount: 1000}
	isAllowed := rbac.With(roles).IsAllowed(order)
	assert.False(t, isAllowed)
}

func TestIsAllowedUsingString(t *testing.T) {
	rolesStr := `
- name:
  permissions:
  - action: update
    target: "order"
    rules:
    - allowed: true
      key: product_name
      operator: eq
      value: Notebook`
	roles, _ := rbac.FromYAML(rolesStr)
	type Order struct {
		ProductName string `json:"product_name"`
		Amount      int    `json:"amount"`
	}
	order := Order{ProductName: "Notebook", Amount: 1000}
	isAllowed := rbac.With(roles).IsAllowed(order)
	assert.True(t, isAllowed)
}

func TestIsAllowedUsingBool(t *testing.T) {
	rolesStr := `
- name:
  permissions:
  - action: update
    target: "order"
    rules:
    - allowed: true
      key: paid
      operator: eq
      value: true`
	roles, _ := rbac.FromYAML(rolesStr)
	type Order struct {
		ProductName string `json:"product_name"`
		Amount      int    `json:"amount"`
		Paid        bool   `json:"paid"`
	}
	order := Order{ProductName: "Notebook", Amount: 1000, Paid: true}
	isAllowed := rbac.With(roles).IsAllowed(order)
	assert.True(t, isAllowed)
}

func TestIsAllowedUsingInvalidOperatorForBool(t *testing.T) {
	rolesStr := `
- name:
  permissions:
  - action: update
    target: "order"
    rules:
    - allowed: true
      key: paid
      operator: gt
      value: true`
	roles, _ := rbac.FromYAML(rolesStr)
	type Order struct {
		ProductName string `json:"product_name"`
		Amount      int    `json:"amount"`
		Paid        bool   `json:"paid"`
	}
	order := Order{ProductName: "Notebook", Amount: 1000, Paid: true}
	isAllowed := rbac.With(roles).IsAllowed(order)
	assert.False(t, isAllowed)
}
