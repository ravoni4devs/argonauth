/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'
import ArgonauthVuetifyPlugin from '@ravoni4devs/argonauth-vuetify-plugin'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)

  app.use(ArgonauthVuetifyPlugin, {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    endpoints: {
      preLogin: '/api/public/account/prelogin',
      login: '/api/public/account/login',
      logout: '/api/private/user/logout',
      whoami: '/api/private/user/me',
    },
    dbName: 'flexterm',
  })
}
