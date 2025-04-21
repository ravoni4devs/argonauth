PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id VARCHAR NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL DEFAULT '',
  email VARCHAR NOT NULL,
  avatar VARCHAR NOT NULL DEFAULT '',
  password VARCHAR NOT NULL,
  salt VARCHAR NOT NULL,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime')),
  updated_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_blocked ON users(blocked);


DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
  id BIGINT NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL DEFAULT '',
  permissions VARCHAR NOT NULL DEFAULT '[]',
  system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
);

CREATE INDEX idx_roles_system ON roles(system);
CREATE INDEX idx_roles_created_at ON roles(created_at);
CREATE UNIQUE INDEX idx_roles_name ON roles(name);


DROP TABLE IF EXISTS group_roles;
CREATE TABLE group_roles (
  created_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime')),
  group_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (group_id, role_id),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
  id BIGINT NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL DEFAULT '',
  system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
);

CREATE UNIQUE INDEX idx_groups_name ON groups(name);
CREATE INDEX idx_groups_system ON groups(system);
CREATE INDEX idx_groups_created_at ON groups(created_at);


DROP TABLE IF EXISTS memberships;
CREATE TABLE memberships (
  created_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime')),
  group_id BIGINT NOT NULL,
  user_id VARCHAR NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS machines;
CREATE TABLE machines (
  id BIGINT NOT NULL PRIMARY KEY,
  hostname VARCHAR NOT NULL DEFAULT '',
  ip VARCHAR NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime')),
  updated_at TIMESTAMP DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
);

CREATE UNIQUE INDEX idx_hostname_ip ON machines(hostname, ip);
