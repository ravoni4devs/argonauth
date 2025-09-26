import makeService from '@/services'
import createPinia from '@/stores'
const pinia = createPinia()

import {useUserStore} from '@/stores/user'

import LoginForm from '@/components/LoginForm.vue'
import LogoutButton from '@/components/LogoutButton.vue'

let argonAuthService = null
const Plugin = {
  install(app, options = {}) {
    app.use(pinia)

    app.component('ArgonAuthForm', LoginForm)
    app.component('ArgonAuthLogoutButton', LogoutButton)

    app.provide('argonAuthStore', useUserStore())

    const service = makeService({
      baseURL: options.baseURL,
      dbName: options.dbName,
      endpoints: options.endpoints,
    })
    app.provide('argonAuth', service)         // usage: service = inject('argonauth')
    app.provide('argonAuthService', service)  // usage: service = inject('argonauthService')
    argonAuthService = service
  }
}

export { LoginForm, makeService, Plugin, argonAuthService }
export default Plugin
