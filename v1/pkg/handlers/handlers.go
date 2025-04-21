package handlers

import (
	"github.com/ravoni4devs/argonauth/v1/pkg/config"
	"github.com/ravoni4devs/argonauth/v1/pkg/logger"
	"github.com/ravoni4devs/argonauth/v1/pkg/types"
)

type HandlerContainer struct {
	config         config.Config
	log            logger.Logger
	repos          types.RepositoryContainer
	accountHandler *AccountHandler
	userHandler    *UserHandler
	groupHandler   *GroupHandler
}

type Option func(*HandlerContainer)

func New(options ...Option) *HandlerContainer {
	hc := &HandlerContainer{}
	for _, opt := range options {
		opt(hc)
	}
	return hc
}

func WithConfig(c config.Config) Option {
	return func(hc *HandlerContainer) {
		hc.config = c
	}
}

func WithLogger(l logger.Logger) Option {
	return func(hc *HandlerContainer) {
		hc.log = l
	}
}

func WithRepositoryContainer(r types.RepositoryContainer) Option {
	return func(hc *HandlerContainer) {
		hc.repos = r
	}
}

func (hc *HandlerContainer) AccountHandler(handlers ...*AccountHandler) *AccountHandler {
	if len(handlers) > 0 {
		hc.accountHandler = handlers[0]
	}
	if hc.accountHandler != nil {
		return hc.accountHandler
	}
	hc.accountHandler = NewAccountHandler(hc.buildParams())
	return hc.accountHandler
}

func (hc *HandlerContainer) UserHandler(handlers ...*UserHandler) *UserHandler {
	if len(handlers) > 0 {
		hc.userHandler = handlers[0]
	}
	if hc.userHandler != nil {
		return hc.userHandler
	}
	hc.userHandler = NewUserHandler(hc.buildParams())
	return hc.userHandler
}

func (hc *HandlerContainer) GroupHandler(handlers ...*GroupHandler) *GroupHandler {
	if len(handlers) > 0 {
		hc.groupHandler = handlers[0]
	}
	if hc.groupHandler != nil {
		return hc.groupHandler
	}
	hc.groupHandler = NewGroupHandler(hc.buildParams())
	return hc.groupHandler
}

func (hc *HandlerContainer) buildParams() *Params {
	p := DefaultParams()
	p.Config(hc.config)
	p.Logger(hc.log)
	p.Repos(hc.repos)
	return p
}
