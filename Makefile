SHELL := /bin/bash

example: run
run:
	@go run cmd/example/main.go

test: tests
tests:
	@SQLITE_ADDRESS=:memory: SQLITE_SCHEMA=$(PWD)/v1/pkg/datastores/schema.sql go test -v -race -count=1 ./v1/...
