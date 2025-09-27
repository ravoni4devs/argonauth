import makeService from '@/services'
import createPinia from '@/stores'
const pinia = createPinia()

import {useUserStore} from '@/stores/user'

import LoginForm from '@/components/LoginForm.vue'
import LogoutButton from '@/components/LogoutButton.vue'

const Plugin = {
  install(app, options = {}) {
    app.use(pinia)

    app.component('ArgonAuthForm', LoginForm)
    app.component('ArgonAuthLogoutButton', LogoutButton)

    app.provide('argonAuthStore', useUserStore())

    const service = options.service || makeService({
      baseURL: options.baseURL,
      dbName: options.dbName,
      endpoints: options.endpoints,
    })
    app.provide('argonAuthService', service)  // usage: service = inject('argonauthService')
  }
}

export { LoginForm, makeService, Plugin }
export default Plugin
