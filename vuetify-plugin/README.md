# argonauth-vuetify-plugin

> A secure Vuetify 3 login form component with AES encryption using @ravoni4devs/libcryptus.

## Installation

Install the library and its peer dependencies:

```sh
npm install @ravoni4devs/argonauth-vuetify-plugin vue vuetify @ravoni4devs/libcryptus
```

## Usage

Setup this plugin in Your Vuetify App:

In your `src/plugins/index.js`:

```javascript
import vuetify from './vuetify'
import router from '@/router'
import ArgonauthVuetifyPlugin from '@ravoni4devs/argonauth-vuetify-plugin'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)

  app.use(ArgonauthVuetifyPlugin, {
    dbName: 'myapp',
    baseURL: 'http://localhost:8001',
    endpoints: {
      preLogin: '/api/public/account/prelogin',
      login: '/api/public/account/loginweb',
      logout: '/api/private/user/logout',
      whoami: '/api/private/user/me',
    },
  })
}
```

### Use default form and logout button components

```vue
<template>
  <v-container class="d-flex justify-center align-center fill-height">
      <v-card
        v-if="user.id"
        class="mx-auto"
        :prepend-avatar="user.avatar"
        :subtitle="user.email"
        :title="user.name"
      >
        <v-card-text>
          <div>ID: {{ user.id }}</div>
          <div>Salt: {{ user.salt }}</div>
        </v-card-text>
        <v-card-actions>
          <argonauth-logout-button @on-success="bye">Sair</argonauth-logout-button>
        </v-card-actions>
      </v-card>
      <argonauth-form
        v-else
        title="Login"
        step-1-subtitle="Informe seu email para comecar"
        step-2-subtitle="Informe sua senha para continuar"
        step-1-submit-button-label="Comecar"
        step-2-submit-button-label="Login"
        back-button-label="Voltar"
        forgot-password-button-label="Recuperar senha"
        forgot-password-text="Esqueceu a senha?"
        @on-step2-success="(account) => console.log(account.user)"
      />
  </v-container>
</template>

<script setup>
import {
  VSheet,
  VForm, VTextField, VBtn, VIcon,
  VCard, VCardItem, VCardTitle, VCardSubtitle, VCardText
} from 'vuetify/components';
</script>
```

### Use functions in custom components

```vue
<template>
  <v-container class="d-flex justify-center align-center fill-height">
      <v-form @submit.prevent="preLogin" v-if="!user.id">
        <div><v-text-field v-model="form.email" /></div>
        <v-btn type="submit">Next</v-btn>
      </v-form>
      <v-form @submit.prevent="login" v-else-if="user.id">
        <div><v-text-field v-model="form.password" /></div>
        <v-btn type="submit">Login</v-btn>
      </v-form>
  </v-container>
</template>

<script setup>
import { inject } from 'vue'

const service = inject('argonAuthService')

const form = ref({
  email: 'me@mail.com',
  password: ''
})

const user = ref({
  id: '',
  email: ''
})

async function preLogin() {
   try {
     const found = await service.preLogin(form.value.email)
     user.value.id = found.id
     user.value.email = found.email
   } catch(err) {
     console.error(err)
   }
}

async function login() {
   try {
     const auth = {...user.value}
     auth.password = form.password
     const account = service.login(auth)
     // redirect to authenticated area
   } catch(err) {
     console.error(err)
   }
}
</script>
```

## Security Notes

- The password is encrypted using AES with a key derived via PBKDF2.
- Use a secure, random salt in production (not the hardcoded 'some-salt').
- Transmit the encrypted password over HTTPS.

## License

MIT License. See the [LICENSE](LICENSE) file for details.

