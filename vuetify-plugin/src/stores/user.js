import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    email: '',
    salt: '',
    avatar: '',
    name: ''
  }),
  actions: {
    setPreLoginInfo(user) {
      this.id = user.id
      this.email = user.email
      this.salt = user.salt
    },
    setUser(user) {
      this.id = user.id
      this.email = user.email
      this.name = user.name
      this.avatar = user.avatar
    },
    clear() {
      this.id = ''
      this.email = ''
      this.name = ''
      this.avatar = ''
      this.salt = ''
    }
  },
  getters: {
    preLoginInfo: (state) => ({
        id: state.id,
        email: state.email,
        salt: state.salt
    }),
    isPreLoginDone: (state) => {
      return state.id && state.id.length > 0 && state.salt && `${state.salt}`.length > 0
    },
    user(state) {
      return {
        id: state.id,
        name: state.name,
        email: state.email,
        avatar: state.avatar
      }
    }
  }
});
