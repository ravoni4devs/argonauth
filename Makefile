SHELL := /bin/bash

example: run
run:
	@go run cmd/example/main.go

lint:
	@goimports -w v1 cmd

test: tests
tests:
	@SQLITE_ADDRESS=:memory: SQLITE_SCHEMA=$(PWD)/v1/pkg/datastores/schema.sql go test -v -race -count=1 ./v1/...
