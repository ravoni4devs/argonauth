package datastores

import (
	"log"
	"os"
	"testing"
)

func SqliteSeed(ts *testing.T, name string, fn func(*testing.T, SqlDataStore)) {
	store := NewSqlite(os.Getenv("SQLITE_ADDRESS"))
	store.Connect()
	file := os.Getenv("SQLITE_SCHEMA")
	b, err := os.ReadFile(file)
	if err != nil {
		log.Fatalf("Cannot read schema file %s: %s", file, err)
	}
	err = store.RunSql(string(b))
	if err != nil {
		log.Fatalf("Cannot exec schema file %s: %s", file, err)
	}
	ts.Run(name, func(t *testing.T) {
		fn(t, store)
	})
}
