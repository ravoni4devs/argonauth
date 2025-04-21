package datastores

import (
	"sync"
	"time"
)

var (
	cacheInstance Cache
	once          sync.Once
)

type memoryCache struct {
	once  sync.Once
	store sync.Map
}

func NewMemoryCache() Cache {
	if cacheInstance == nil {
		once.Do(func() {
			cacheInstance = &memoryCache{}
		})
	}
	return cacheInstance
}

func (c *memoryCache) Set(key string, value any, ttl time.Duration) {
	c.store.Store(key, value)
	time.AfterFunc(ttl, func() {
		c.store.Delete(key)
	})
}

func (c *memoryCache) Get(key string) (any, bool) {
	return c.store.Load(key)
}

func (c *memoryCache) Delete(key string) {
	c.store.Delete(key)
}
