package datastores

import (
	"context"
	"time"
)

type DataStore interface {
	Sqlite() SqlDataStore
	MemoryCache() Cache
}

type Cache interface {
	Set(key string, value any, ttl time.Duration)
	Get(key string) (any, bool)
	Delete(key string)
}

type SqlDataStore interface {
	WithContext(ctx context.Context) SqlDataStore
	Ping() error
	RunSql(schema string) error
	CreateDatabase(schema ...string) error
	Get(query string, found any, args ...any) error
	Query(query string, found any, args ...any) error
	QueryOne(query string, found any, args ...any) error
	QueryAll(query string, found any, args ...any) error
	Exec(query string, args ...any) error
	ExecAndReturnID(query string, args ...any) (string, error)
	ExecAndReturnRowsAffected(query string, args ...any) (int64, error)
	BulkInsert(table string, columns []string, rows [][]any) error
	Begin() (SqlDataStore, error)
	Commit() error
	Rollback() error
	Connect() error
}
