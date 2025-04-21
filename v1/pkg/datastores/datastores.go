package datastores

type dataStoreContainer struct {
	sqlite        SqlDataStore
	cache         Cache
	sqliteAddress string
}

type Option func(*dataStoreContainer)

func WithSqlite(input string) Option {
	return func(dsc *dataStoreContainer) {
		dsc.sqliteAddress = input
	}
}

func New(options ...Option) DataStore {
	dsc := &dataStoreContainer{}
	for _, opt := range options {
		opt(dsc)
	}
	return dsc
}

func (dsc *dataStoreContainer) Sqlite() SqlDataStore {
	if dsc.sqlite == nil {
		var address = dsc.sqliteAddress
		dsc.sqlite = NewSqlite(address)
	}
	return dsc.sqlite
}

func (d *dataStoreContainer) MemoryCache() Cache {
	return NewMemoryCache()
}
