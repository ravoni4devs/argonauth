package dto

type UserTable struct {
	ID       string `db:"id"`
	Name     string `db:"name"`
	Avatar   string `db:"avatar"`
	Email    string `db:"email"`
	Password string `db:"password"`
	Salt     string `db:"salt"`
	Blocked  bool   `db:"blocked"`
	// PrivateKey string `db:"private_key"`
	// PublicKey  string `db:"public_key"`
}

type RoleTable struct {
	ID          uint64 `db:"id"`
	Name        string `db:"name"`
	Permissions string `db:"permissions"`
	System      bool   `db:"system"`
}

type GroupRoleTable struct {
	RoleID  uint64 `db:"role_id"`
	GroupID uint64 `db:"group_id"`
}

type GroupTable struct {
	ID     uint64 `db:"id"`
	Name   string `db:"name"`
	System bool   `db:"system"`
}

type MembershipTable struct {
	UserID  string `db:"user_id"`
	GroupID uint64 `db:"group_id"`
}
