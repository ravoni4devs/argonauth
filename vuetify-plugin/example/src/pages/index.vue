<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card
      v-if="account.id"
      class="mx-auto"
      :prepend-avatar="account.avatar"
      :subtitle="account.email"
      :title="account.name"
    >
      <v-card-text>
        <div>ID: {{ account.id }}</div>
        <div>Salt: {{ account.salt }}</div>
      </v-card-text>
      <v-card-actions>
        <argonauth-logout-button @click="actions.logout()">Sair</argonauth-logout-button>
      </v-card-actions>
    </v-card>
    <argonauth-form
      v-else
      title="MyApp"
      :step1="step1"
      :step2="step2"
      :forgot-password="forgotPassword"
      :actions="actions"
      @on-step2-success="user => account = user"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

import {
  VSheet,
  VForm, VTextField, VBtn, VIcon,
  VCard, VCardItem, VCardTitle, VCardSubtitle, VCardText
} from 'vuetify/components';

const step1 = {
  subtitle: 'Informe seu email para começar',
  submitButtonLabel: 'Começar',
  registerText: 'Primeira vez? ',
  registerButtonLabel: 'Cadastre-se agora!',
  emailIcon: 'mdi-email-outline'
}

const step2 = {
  subtitle: 'Informe sua senha para continuar',
  submitButtonLabel: 'Entrar',
  backButtonLabel: 'Voltar',
  loginText: 'Já possui conta? ',
  loginButtonLabel: 'Entrar',
  accountIcon: 'mdi-account-circle',
  passwordVisibleIcon: 'mdi-eye',
  passwordHiddenIcon: 'mdi-eye-off',
  passwordIcon: 'mdi-lock-outline',
}

const forgotPassword = {
  text: 'Esqueceu a senha?',
  buttonLabel: 'Recuperar senha',
}

const actions = {
  preLogin: (store, email) => {
    store.setPreLoginInfo({
      id: '1',
      salt: '12345678',
      email
    })
  },
  login: (store, password) => {
    const user = store.preLoginInfo
    user.rawPassword = password
    store.setUser(user)
    account.value = user
  },
  logout: (store) => {
    account.value = {}
    store?.clear()
  }
}

const account = ref({})
</script>
