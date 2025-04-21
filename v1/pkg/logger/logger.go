package logger

import (
	"log"
)

type Logger interface {
	Error(v ...any)
	Info(v ...any)
	Debug(v ...any)
}

type defaultLogger struct {
	debug bool
	level int
}

type Option func(*defaultLogger)

func New(options ...Option) Logger {
	l := &defaultLogger{}
	for _, opt := range options {
		opt(l)
	}
	return l
}

func WithDebug() Option {
	return func(l *defaultLogger) {
		l.debug = true
	}
}

func Get() Logger {
	return New(WithDebug())
}

func (s *defaultLogger) Error(v ...any) {
	if s.debug {
		log.Println("[ERROR]", v)
	}
}

func (s *defaultLogger) Info(v ...any) {
	if s.debug {
		log.Println("[INFO]", v)
	}
}

func (s *defaultLogger) Debug(v ...any) {
	if s.debug {
		log.Println("[DEBUG]", v)
	}
}
