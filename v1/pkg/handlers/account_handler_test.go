package handlers_test

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"testing"

	"github.com/ravoni4devs/argonauth/v1/internal/testify/assert"
	"github.com/ravoni4devs/argonauth/v1/internal/testify/httptest"
	"github.com/ravoni4devs/argonauth/v1/pkg/datastores"
	"github.com/ravoni4devs/argonauth/v1/pkg/dto"
	"github.com/ravoni4devs/argonauth/v1/pkg/handlers"
	"github.com/ravoni4devs/argonauth/v1/pkg/repositories"
)

func TestAccountHandler(t *testing.T) {
	var (
		url       = "/web/setup/finish"
		dbAddress = filepath.Join(os.TempDir(), "database.db")
		params    = handlers.DefaultParams()
	)
	params.Repos(repositories.NewRepositoryContainer(datastores.New(datastores.WithSqlite(dbAddress))))
	var payload = dto.SetupRequest{
		UserRegisterRequest: dto.UserRegisterRequest{
			Name:     "gustavo",
			Password: "xxxxxxxxxx",
			Email:    "gustavo@mail.com",
			Salt:     "12345678",
		},
	}
	os.Remove(dbAddress)
	var handler = handlers.NewAccountHandler(params)
	jsonReq, _ := json.Marshal(payload)
	req := httptest.NewClient().DoPOST(url, string(jsonReq))
	server := httptest.OnPOST(url, handler.Setup)
	var body dto.HttpResponse
	resp, err := server.ServeHTTP(req, &body)
	assert.Nil(t, err)
	assert.Equal(t, http.StatusCreated, resp.StatusCode)
	_, err = os.Stat(dbAddress)
	assert.Nil(t, err)
}
