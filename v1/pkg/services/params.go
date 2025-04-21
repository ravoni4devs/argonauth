package services

import (
	"github.com/ravoni4devs/argonauth/v1/pkg/config"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
)

type Params struct {
	Repos  types.RepositoryContainer
	Config config.Config
}
