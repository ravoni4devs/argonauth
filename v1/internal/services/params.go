package services

import (
	"github.com/ravoni4devs/argonauth/v1/internal/config"
	"github.com/ravoni4devs/argonauth/v1/internal/types"
)

type Params struct {
	Repos  types.RepositoryContainer
	Config config.Config
}
