package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/ravoni4devs/libcryptus/cryptus"

	"github.com/ravoni4devs/argonauth/v1/pkg/models"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
	"github.com/ravoni4devs/argonauth/v1/pkg/types/customerror"
	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid"
)

type accountService struct {
	repos                 types.RepositoryContainer
	defaultGroupName      string
	defaultAdminGroupName string
	generator             uniqid.UniqID
}

func NewAccountService(params Params) types.AccountService {
	return &accountService{
		repos:                 params.Repos,
		generator:             uniqid.New(),
		defaultGroupName:      params.Config.GetDefaultGroupName(),
		defaultAdminGroupName: params.Config.GetDefaultAdminGroupName(),
	}
}

func (s *accountService) Register(ctx context.Context, user models.User) (models.User, error) {
	// if err := s.validatePublicKey(user); err != nil {
	//     return user, customerror.InvalidInput(err)
	// }
	group, err := s.getOrCreateDefaultGroupForNewUsers(ctx)
	if err != nil {
		return user, customerror.Wrap(err)
	}
	user.ID = s.generator.UuidV7()
	user.Avatar = s.useGravatarIfEmpty(user)
	var userRepository = s.repos.UserRepository()
	created, err := userRepository.Create(ctx, user)
	if err != nil {
		return user, customerror.Wrap(err)
	}
	err = userRepository.AddMembership(ctx, created, group)
	created.Groups = []models.Group{group}
	return created, err
}

func (s *accountService) Authenticate(account, found models.User) error {
	if account.ID != found.ID {
		return customerror.Denied(fmt.Errorf("mismatch IDs: got %s but want %s", account.ID, found.ID))
	}
	if account.Password != found.Password {
		return customerror.Denied(errors.New("passwords mismatch"))
	}
	if found.Blocked {
		return customerror.Locked(errors.New("account is locked"))
	}
	return nil
}

func (s *accountService) Login(ctx context.Context, account models.User) (models.User, error) {
	userRepository := s.repos.UserRepository()
	found, err := userRepository.GetByEmail(ctx, account.Email)
	if err != nil {
		return account, customerror.Wrap(err)
	}
	if err := s.Authenticate(account, found); err != nil {
		return account, err
	}
	groups, err := userRepository.GetGroups(ctx, account)
	if err != nil {
		return account, customerror.Wrap(err)
	}
	found.Groups = groups
	return found, nil
}

func (s *accountService) CreateDatabase(ctx context.Context) error {
	err := s.repos.Sqlite().WithContext(ctx).CreateDatabase()
	if err != nil {
		return customerror.Unavailable(err)
	}
	return nil
}

func (s *accountService) CreateAdmin(ctx context.Context, user models.User) (models.User, error) {
	// if err := s.validatePublicKey(user); err != nil {
	//     return user, customerror.InvalidInput(err)
	// }
	group, err := s.createAdminsGroup(ctx)
	if err != nil {
		return user, customerror.Wrap(err)
	}
	s.createAuthorsGroup(ctx)
	user.ID = s.generator.UuidV4()
	user.Avatar = s.useGravatarIfEmpty(user)
	var userRepository = s.repos.UserRepository()
	created, err := userRepository.Create(ctx, user)
	if err != nil {
		return user, customerror.Wrap(err)
	}
	err = userRepository.AddMembership(ctx, created, group)
	created.Groups = []models.Group{group}
	return created, err
}

func (s *accountService) getOrCreateDefaultGroupForNewUsers(ctx context.Context) (models.Group, error) {
	var groupRepository = s.repos.GroupRepository()
	var defaultGroupName = s.defaultGroupName
	var group models.Group
	var err error
	group, err = groupRepository.GetByName(ctx, defaultGroupName)
	if err == nil {
		return group, nil
	}
	role := models.Role{}
	role.ID = s.generator.ID()
	role.System = true
	role.Name = "Regular user"
	role.Permissions = `[{
		"action": "read",
		"target": "content"
	}, {
		"action": "create",
		"target": "ticket"
	}, {
	   "action": "admin",
	   "target": "user",
	   "rules": [
		 {
		   "allowed": true,
		   "key": "id",
		   "operator": "eq",
		   "value": "{{.ID}}"
		 }
	   ]
	}, {
	   "action": "admin",
	   "target": "account",
	   "rules": [
		 {
		   "allowed": true,
		   "key": "id",
		   "operator": "eq",
		   "value": "{{.ID}}"
		 }
	   ]
    }]`
	_, err = s.repos.RoleRepository().Create(ctx, role)
	if err != nil {
		return group, err
	}
	group.ID = s.generator.ID()
	group.Name = defaultGroupName
	group.System = true
	group.Roles = []models.Role{role}
	_, err = groupRepository.Create(ctx, group)
	if err != nil {
		return group, err
	}
	err = groupRepository.AttachRoles(ctx, group)
	group.Roles = []models.Role{role}
	return group, err
}

func (s *accountService) createAdminsGroup(ctx context.Context) (models.Group, error) {
	role := models.Role{}
	role.ID = s.generator.ID()
	role.System = true
	role.Name = "SuperAdmin"
	role.Permissions = `[{
		"action": "admin",
		"target": "*"
	}]`
	name := s.defaultAdminGroupName
	return s.createSystemGroup(ctx, name, role)
}

func (s *accountService) createAuthorsGroup(ctx context.Context) (models.Group, error) {
	role := models.Role{}
	role.ID = s.generator.ID()
	role.System = true
	role.Name = "Manager"
	role.Permissions = `[{
		"action": "admin",
		"target": "content"
	}]`
	name := "Manager"
	return s.createSystemGroup(ctx, name, role)
}

func (s *accountService) createSystemGroup(ctx context.Context, name string, role models.Role) (models.Group, error) {
	var repo = s.repos.GroupRepository()
	var err error
	_, err = s.repos.RoleRepository().Create(ctx, role)
	if err != nil {
		return models.Group{}, err
	}
	group := models.Group{}
	group.ID = s.generator.ID()
	group.System = true
	group.Name = name
	group.Roles = []models.Role{role}
	_, err = repo.Create(ctx, group)
	if err != nil {
		return group, err
	}
	err = repo.AttachRoles(ctx, group)
	return group, err
}

func (s *accountService) useGravatarIfEmpty(user models.User) string {
	if user.Avatar != "" {
		return user.Avatar
	}
	hash := cryptus.New().Sha256(user.Email)
	return fmt.Sprintf("https://www.gravatar.com/avatar/%s", hash)
}

// func (s *accountService) validatePublicKey(account models.User) error {
//     decoded, err := hex.DecodeString(account.PublicKey)
//     if err != nil {
//         return err
//     }
//     _, err = cryptus.New().ParseRSAPublicKeyFromPEM(string(decoded))
//     return err
// }
