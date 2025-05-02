import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    currentUser: {},
    roles: [],
    groups: [],
    users: []
  }),
  actions: {
    setCurrentUser(user) {
      this.currentUser = user
    },
    setRoles(roles) {
      this.roles = roles
    },
    addRole(role) {
      this.roles.unshift(role)
    },
    removeRole(role) {
      this.roles = this.roles.filter(r => r.id !== role.id)
    },
    updateRole(role) {
      this.roles = this.roles.map(r => {
        if (r.id === role.id) {
          return role
        }
        return r
      })
    },
    setGroups(groups) {
      this.groups = groups
    },
    addGroup(group) {
      this.groups.unshift(group)
    },
    removeGroup(group) {
      this.groups = this.groups.filter(r => r.id !== group.id)
    },
    updateGroup(group) {
      this.groups = this.groups.map(r => {
        if (r.id === group.id) {
          return group
        }
        return r
      })
    },
    setUsers(users) {
      this.users = users
    },
    addUser(user) {
      this.users.unshift(user)
    },
    removeUser(user) {
      this.users = this.users.filter(r => r.id !== user.id)
    },
    updateUser(user) {
      this.users = this.users.map(r => {
        if (r.id === user.id) {
          return user
        }
        return r
      })
    }
  },
  getters: {
    actions: () => ['admin', 'create', 'read', 'remove', 'edit', 'manage'],
    targets: () => ['content', 'ticket', 'account']
  }
})
