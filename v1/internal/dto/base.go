package dto

type SearchRequest struct {
	Page    int    `json:"page"`
	PerPage int    `json:"per_page"`
	OrderBy string `json:"order_by"`
	Sort    string `json:"sort"`
	Term    string `json:"term"`
}

type SavedResponse struct {
	ID string `json:"id"`
}

type UserRequest struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email" valid:"email"`
	Avatar string `json:"avatar"`
}

type UserRegisterRequest struct {
	Name     string `json:"name" form:"name"`
	Email    string `json:"email" form:"email" valid:"email"`
	Avatar   string `json:"avatar"`
	Password string `json:"password" form:"password" valid:"required"`
	Salt     string `json:"salt" form:"salt" valid:"required"`
	// PrivateKey string `json:"private_key"`
	// PublicKey  string `json:"public_key"`
}

type SetupRequest struct {
	UserRegisterRequest
}

type UserRegisterResponse struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Avatar string `json:"avatar"`
}

type UserLoginRequest struct {
	ID       string `json:"id"`
	Email    string `json:"email" form:"email" valid:"required,email"`
	Password string `json:"password" form:"password"`
}

type UserLoginResponse struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Avatar string `json:"avatar"`
	Salt   string `json:"salt"`
}

type UserUpdateRequest struct {
	Name    string `json:"name" valid:"required"`
	Avatar  string `json:"avatar" valid:"required"`
	Blocked bool   `json:"blocked"`
}

type UserUpdateGroupsRequest struct {
	Groups []GroupRequest `json:"groups" valid:"required"`
}

type UserResponse struct {
	ID      string          `json:"id"`
	Name    string          `json:"name"`
	Email   string          `json:"email"`
	Avatar  string          `json:"avatar"`
	Blocked bool            `json:"blocked"`
	Groups  []GroupResponse `json:"groups"`
}

type RoleResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Permissions string `json:"permissions"`
	System      bool   `json:"system"`
	CreatedAt   string `json:"created_at"`
}

type RoleCreateRequest struct {
	Name        string `json:"name" valid:"required"`
	Permissions string `json:"permissions" valid:"required"`
}

type RoleRequest struct {
	ID   string `json:"id" valid:"required"`
	Name string `json:"name"`
}

type RoleUpdateRequest struct {
	ID          string `json:"id" valid:"required"`
	Name        string `json:"name" valid:"required"`
	Permissions string `json:"permissions" valid:"required"`
}

type RoleGroupsRequest struct {
	SearchRequest
	RoleID string `json:"role_id"`
}

type GroupResponse struct {
	ID        string         `json:"id"`
	Name      string         `json:"name"`
	System    bool           `json:"system"`
	Roles     []RoleResponse `json:"roles"`
	CreatedAt string         `json:"created_at"`
}

type GroupRequest struct {
	ID     string `json:"id" valid:"required"`
	Name   string `json:"name"`
	System bool   `json:"system"`
}

type GroupCreateRequest struct {
	Name  string        `json:"name" valid:"required"`
	Roles []RoleRequest `json:"roles" valid:"required"`
}

type GroupUpdateRequest struct {
	ID    string        `json:"id" valid:"required"`
	Name  string        `json:"name" valid:"required"`
	Roles []RoleRequest `json:"roles"`
}

type GroupEditRolesRequest struct {
	ID    string        `json:"id" valid:"required"`
	Roles []RoleRequest `json:"roles" valid:"required"`
}
