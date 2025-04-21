package handlers

import (
	"github.com/ravoni4devs/argonauth/v1/internal/config"
	"github.com/ravoni4devs/argonauth/v1/internal/datastores"
	"github.com/ravoni4devs/argonauth/v1/internal/logger"
	"github.com/ravoni4devs/argonauth/v1/internal/repositories"
	"github.com/ravoni4devs/argonauth/v1/internal/types"
)

type Params struct {
	repos  types.RepositoryContainer
	log    logger.Logger
	config config.Config
}

func DefaultParams() *Params {
	p := &Params{}
	p.log = logger.Get()
	p.repos = repositories.NewRepositoryContainer(datastores.New())
	p.config = config.Config{}
	return p
}

func (p *Params) Logger(input ...logger.Logger) logger.Logger {
	if len(input) > 0 {
		p.log = input[0]
	}
	return p.log
}

func (p *Params) Repos(input ...types.RepositoryContainer) types.RepositoryContainer {
	if len(input) > 0 {
		p.repos = input[0]
	}
	return p.repos
}

func (p *Params) Config(input ...config.Config) config.Config {
	if len(input) > 0 {
		p.config = input[0]
	}
	return p.config
}
