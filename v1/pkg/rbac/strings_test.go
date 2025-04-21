package rbac_test

import (
	"testing"

	"github.com/ravoni4devs/argonauth/v1/pkg/rbac"
	"github.com/ravoni4devs/argonauth/v1/pkg/rbac/test/assert"
)

func TestFromJSON(t *testing.T) {
	rolesStr := `[{
        "id": "r1",
        "name": "Attendant",
        "permissions": [{
            "id": "p1",
            "name": "read orders",
            "action": "read",
            "target": "orders",
            "rules": [
                {
                    "allow": true,
                    "key": "*",
                    "operator": "=",
                    "value": "*"
                }
            ]
        }]
    }]`
	roles, err := rbac.FromJSON(rolesStr)
	assert.Nil(t, err)
	assert.Equal(t, len(roles), 1)
}

func TestFromYAML(t *testing.T) {
	rolesStr := `
- name: attendant
  permissions:
  - action: read
    target: "*"
  - action: update
    target: order`
	roles, err := rbac.FromYAML(rolesStr)
	assert.Nil(t, err)
	assert.Equal(t, len(roles), 1)
}
