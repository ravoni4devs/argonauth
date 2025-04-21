package repositories

import (
	"github.com/ravoni4devs/argonauth/v1/internal/datastores"
	"github.com/ravoni4devs/argonauth/v1/internal/types"
)

type container struct {
	userRepository  types.UserRepository
	groupRepository types.GroupRepository
	roleRepository  types.RoleRepository
	sqlite          datastores.SqlDataStore
}

func NewRepositoryContainer(ds datastores.DataStore) types.RepositoryContainer {
	var instance = container{}
	if ds != nil {
		var sqlite = ds.Sqlite()
		instance.sqlite = sqlite
		instance.userRepository = NewUserRepository(sqlite)
		instance.groupRepository = NewGroupRepository(sqlite)
		instance.roleRepository = NewRoleRepository(sqlite)
	}
	return instance
}

func (c container) Sqlite() datastores.SqlDataStore {
	return c.sqlite
}

func (c container) UserRepository() types.UserRepository {
	return c.userRepository
}

func (c container) GroupRepository() types.GroupRepository {
	return c.groupRepository
}

func (c container) RoleRepository() types.RoleRepository {
	return c.roleRepository
}
