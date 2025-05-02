import makeController from '@/controllers'
import createPinia from '@/stores'
const pinia = createPinia()

import {useUserStore} from '@/stores/user'

import LoginForm from '@/components/LoginForm.vue'
import LogoutButton from '@/components/LogoutButton.vue'

let argonauthController = null
const Plugin = {
  install(app, options = {}) {
    app.use(pinia)

    app.component('ArgonauthForm', LoginForm)
    app.component('ArgonauthLogoutButton', LogoutButton)

    app.provide('argonauthStore', useUserStore())

    const controller = makeController({
      baseURL: options.baseURL,
      dbName: options.dbName,
      endpoints: options.endpoints,
    })
    app.provide('argonauth', controller)
    app.provide('argonauthController', controller)  // usage: controller = inject('argonauthController')
    argonauthController = controller
  }
}

export { LoginForm, makeController, Plugin, argonauthController }
export default Plugin
