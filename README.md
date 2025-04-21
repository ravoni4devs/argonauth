# Argonauth

Argonauth is a Go library designed to provide authentication and Role-Based Access Control (RBAC) 
for web applications using the Echo framework. It supports persistent data storage with SQLite, PostgreSQL, or MySQL databases, 
and includes features like JWT-based authentication, RBAC middleware, and configurable options for caching and JWT auth using cookies.

## Features

- Authentication: Secure user authentication with JWT tokens.
- RBAC: Role-Based Access Control for fine-grained permission management.
- Database Support: Persist data in SQLite, PostgreSQL, or MySQL.
- Echo Integration: Seamless integration with the Echo framework via handlers and middleware.
- Configurable Options: Enable stateful auth, caching, debugging, and customize token and group settings.
- Middleware: Built-in middleware for JWT validation and RBAC enforcement.

## Installation

Ensure you have the Echo framework and a supported database driver (e.g., github.com/mattn/go-sqlite3 for SQLite) installed in your project.

```sh
go get -u github.com/ravoni4devs/argonauth
```

## Usage

A full example can be found in `cmd/example/main.go`.

Here’s an example of how to set up Argonauth with an Echo server:

```go
package main

import (
    "time"
    "github.com/labstack/echo/v4"
    "github.com/ravoni4devs/argonauth/v1"
)

func getHttpServer() *echo.Echo {
    return echo.New()
}

func main() {
    var e = getHttpServer()

    var auth = argonauth.New(
        argonauth.EnableStatefulAuth(),
        argonauth.UseCache(),
        argonauth.EnableDebug(),
        argonauth.SetSqlite("database.db"),
        argonauth.SetGroupOptions(argonauth.GroupOptions{
            DefaultGroupName:      "Guests",
            DefaultAdminGroupName: "Authors",
        }),
        argonauth.SetTokenOptions(argonauth.TokenOptions{
            Secret:     "123456",
            Expiration: time.Minute * 60,
            Audience:   "myapp",
            Issuer:     "myproject",
        }),
    )

    // Register setup handlers for create database and admin user
    auth.RegisterSetupHandlers(e.Group("/web/setup/finish"))

    // Register default authentication handlers
    auth.RegisterDefaultHandlers(e)

    // Apply middleware for JWT validation and RBAC
    auth.UseDefaultJwtCookieMiddleware(e)
    auth.UseDefaultRbacMiddleware(e)

    // Start the server
    e.Start(":8080")
}
```

### Explanation of Options

- EnableStatefulAuth(): Enables stateful authentication, storing session on cookie
- UseCache(): Enables caching for improved performance getting user's roles.
- EnableDebug(): Turns on log messages for troubleshooting.
- SetSqlite("database.db"): Configures SQLite as the database (alternatively, use SetPostgres or SetMysql).
- SetGroupOptions: Sets default group names for users and admins.
- SetTokenOptions: Configures JWT token settings (secret, expiration, audience, issuer).

### API Endpoints

After registering handlers, Argonauth provides the following endpoints:

#### Public Endpoints (/argonauth/public)

These endpoints are accessible without authentication:

- `POST /argonauth/public/account/register`: Register a new user account.
- `POST /argonauth/public/account/prelogin`: Perform pre-login checks (e.g., validate credentials before login).
- `POST /argonauth/public/account/loginweb`: Log in using stateful authentication with cookies (enabled if EnableStatefulAuth is set).
- `POST /argonauth/public/account/login`: Log in using authentication based on Bearer header with JWT (enabled unless DisableStatelessAuth is set).

#### Private Endpoints (/argonauth/private)

These endpoints require authentication and appropriate RBAC permissions:

**User Management**

- `POST /argonauth/private/user/search`: Search for users.
- `PUT /argonauth/private/user/update/:id`: Update a user by ID.
- `PUT /argonauth/private/user/:id/membership`: Set memberships for a user by ID.
- `GET /argonauth/private/user/me`: Get the authenticated user's details (whoami).

**Group Management**

- `POST /argonauth/private/group/search`: Search for groups.
- `POST /argonauth/private/group/create`: Create a new group.
- `PUT /argonauth/private/group/update/:id`: Update a group by ID.
- `DELETE /argonauth/private/group/remove/:id`: Remove a group by ID.
- `POST /argonauth/private/group/:id/roles`: Attach roles to a group by ID.
- `GET /argonauth/private/group/:id/users`: Get users in a group by ID.

**Role Management**

- `POST /argonauth/private/role/search`: Search for roles.
- `POST /argonauth/private/role/create`: Create a new role.
- `PUT /argonauth/private/role/update/:id`: Update a role by ID.
- `DELETE /argonauth/private/role/remove/:id`: Remove a role by ID.
- `GET /argonauth/private/role/:id/groups`: Get groups associated with a role by ID.

**Setup Endpoint**

- `GET /web/setup/finish`: Setup endpoint for initial configuration (if registered).

Middleware ensures private endpoints (/argonauth/private) require a valid JWT and appropriate RBAC permissions.

## Contributing

1. Open an issue and describe your pain
2. Fork the repo
3. Create a new branch: git checkout -b feature/my-feature
4. Commit your changes
5. Push and open a PR

Please follow the project’s coding style and include tests when possible.

## License

MIT License. See the [LICENSE](LICENSE) file for details.

