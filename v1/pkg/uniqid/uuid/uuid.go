package uuid

import (
	"strconv"
	"sync"
	"time"

	"github.com/google/uuid"
)

type IDGenerator struct {
	mu      sync.Mutex
	counter int64
}

func New() *IDGenerator {
	return &IDGenerator{
		counter: 0,
	}
}

func (gen *IDGenerator) Generate() string {
	gen.mu.Lock()
	defer gen.mu.Unlock()
	now := time.Now().UnixNano()
	gen.counter++
	uniqueID := strconv.FormatInt(now, 10) + "-" + strconv.FormatInt(gen.counter, 10)
	return uniqueID
}

func NewV4() string {
	u, err := uuid.NewRandom()
	if err != nil {
		return ""
	}
	return u.String()
}

func NewV7() string {
	u, err := uuid.NewV7()
	if err != nil {
		return ""
	}
	return u.String()
}

func IsInvalid(s string) bool {
	_, err := uuid.Parse(s)
	return err != nil
}
