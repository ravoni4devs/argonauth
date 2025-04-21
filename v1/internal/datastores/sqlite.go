package datastores

import (
	"context"
	"database/sql"
	_ "embed"
	"errors"
	"fmt"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

//go:embed schema.sql
var sqliteSchema string

type SqliteStore struct {
	connection *sqlx.DB
	ctx        context.Context
	tx         *sqlx.Tx
	address    string
}

func NewSqlite(address string) SqlDataStore {
	return &SqliteStore{
		address: address,
		ctx:     context.Background(),
	}
}

func (store *SqliteStore) Connect() error {
	conn, err := sqlx.ConnectContext(store.getCtx(), "sqlite3", store.address)
	if err != nil {
		return err
	}
	store.connection = conn
	return nil
}

func (store *SqliteStore) Ping() error {
	if store.connection != nil {
		return store.connection.Ping()
	}
	if err := store.Connect(); err != nil {
		return err
	}
	return store.connection.Ping()
}

func (store *SqliteStore) WithContext(ctx context.Context) SqlDataStore {
	return &SqliteStore{
		address:    store.address,
		connection: store.connection,
		tx:         store.tx,
		ctx:        ctx,
	}
}

func (store *SqliteStore) CreateDatabase(schema ...string) error {
	var sql = sqliteSchema
	var address = store.address
	if len(schema) > 0 {
		sql = schema[0]
	}
	if sql == "" {
		return fmt.Errorf("no schema found to created database %s", address)
	}
	_, err := os.Stat(address)
	if os.IsNotExist(err) {
		err = store.RunSql(sql)
		if err != nil {
			return err
		}
		_, err = os.Stat(address)
		return err
	}
	return fmt.Errorf("database name %s already exists", address)
}

func (store *SqliteStore) RunSql(sql string) error {
	conn, err := store.getConnection()
	if err != nil {
		return err
	}
	_, err = conn.Exec(sql)
	return err
}

func (store *SqliteStore) Get(query string, found any, args ...any) error {
	conn, err := store.getConnection()
	if err != nil {
		return err
	}
	return conn.GetContext(store.getCtx(), found, query, args...)
}

func (store *SqliteStore) QueryOne(query string, found any, args ...any) error {
	return store.Get(query, found, args...)
}

func (store *SqliteStore) Query(query string, found any, args ...any) error {
	conn, err := store.getConnection()
	if err != nil {
		return err
	}
	err = conn.QueryRowxContext(store.getCtx(), query, args...).StructScan(found)
	return err
}

func (store *SqliteStore) QueryAll(query string, found any, args ...any) error {
	conn, err := store.getConnection()
	if err != nil {
		return err
	}
	err = conn.SelectContext(store.getCtx(), found, query, args...)
	return err
}

func (store *SqliteStore) Exec(query string, args ...any) error {
	if store.tx != nil {
		tx := store.tx
		result, err := tx.ExecContext(store.getCtx(), query, args...)
		if err != nil {
			return err
		}
		rows, err := result.RowsAffected()
		if rows == 0 || err != nil {
			return fmt.Errorf("no rows affected")
		}
		return nil
	}
	conn, err := store.getConnection()
	if err != nil {
		return err
	}
	result, err := conn.ExecContext(store.getCtx(), query, args...)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if rows == 0 || err != nil {
		return fmt.Errorf("no rows affected")
	}
	return nil
}

func (store *SqliteStore) ExecAndReturnID(query string, args ...any) (string, error) {
	conn, err := store.getConnection()
	if err != nil {
		return "", err
	}
	result, err := conn.ExecContext(store.getCtx(), query, args...)
	if err != nil {
		return "", err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%d", id), nil
}

func (store *SqliteStore) ExecAndReturnRowsAffected(query string, args ...any) (int64, error) {
	conn, err := store.getConnection()
	if err != nil {
		return 0, err
	}
	result, err := conn.ExecContext(store.getCtx(), query, args...)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func (store *SqliteStore) BulkInsert(table string, columns []string, rows [][]any) error {
	// Not implemented
	return nil
}

func (store *SqliteStore) Begin() (SqlDataStore, error) {
	conn, err := store.getConnection()
	if err != nil {
		return store, err
	}
	tx, err := conn.BeginTxx(store.getCtx(), &sql.TxOptions{Isolation: sql.LevelDefault})
	if err == nil {
		store.tx = tx
	}
	return store, err
}

func (store *SqliteStore) Rollback() error {
	if store.tx != nil {
		err := store.tx.Rollback()
		store.tx = nil
		return err
	}
	return errors.New("rollback cannot be executed because there isnt transaction in progress")
}

func (store *SqliteStore) Commit() error {
	if store.tx != nil {
		err := store.tx.Commit()
		store.tx = nil
		return err
	}
	return errors.New("commit cannot be executed because there isnt transaction in progress")
}

func (store *SqliteStore) getConnection() (*sqlx.DB, error) {
	var err error
	if store.connection == nil {
		if err := store.Connect(); err != nil {
			return store.connection, err
		}
	}
	return store.connection, err
}

func (store *SqliteStore) getCtx() context.Context {
	if store.ctx != nil {
		return store.ctx
	}
	return context.Background()
}
