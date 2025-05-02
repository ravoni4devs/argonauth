<template>
  <!-- eslint-disable vue/no-v-html -->
  <v-sheet class="login-container" rounded elevation="4">
    <v-card class="login-card pa-6" variant="flat" width="500">
      <v-card-item>
        <v-card-title class="text-center text-h4 mb-4">{{ props.title }}</v-card-title>
      </v-card-item>

      <v-form @submit.prevent="preLogin" v-if="!store.isPreLoginDone">
        <v-card-subtitle class="text-center mb-6">
          {{ props.step1Subtitle }}
        </v-card-subtitle>
        <v-text-field
          v-model="form.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          :disabled="form.loading"
          autofocus
          required
        ></v-text-field>
        <v-btn
          block
          color="primary"
          size="large"
          :loading="form.loading"
          type="submit"
          class="mt-6"
        >
          {{ props.step1SubmitButtonLabel }}
        </v-btn>

        <div class="text-center mt-6" v-if="hasRegister">
          <span class="text-body-2">{{ props.registerText }}</span>
          <a href="#" class="text-decoration-none">{{ props.registerButtonLabel }}</a>
        </div>
      </v-form>
      <v-form v-else-if="store.isPreLoginDone" @submit.prevent="login">
        <v-card-subtitle class="text-center mb-6">
          <div class="d-flex align-center justify-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
            <span>{{ form.email }}</span>
          </div>
          {{ props.step2Subtitle }}
        </v-card-subtitle>
        <v-text-field
          v-model="form.password"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="isPasswordVisible ? 'text' : 'password'"
          label="Password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          autofocus
          required
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        ></v-text-field>

        <div class="d-flex flex-column ga-3">
          <v-btn
            block
            color="primary"
            size="large"
            :loading="form.loading"
            type="submit"
          >
            {{ props.step2SubmitButtonLabel }}
          </v-btn>

          <v-btn
            variant="text"
            :disabled="form.loading"
            block
          >
            {{ props.backButtonLabel }}
          </v-btn>
        </div>

        <div class="text-center mt-6" v-if="props.forgotPasswordText">
          {{ props.forgotPasswordText }}
          <a href="#" class="text-decoration-none">{{ props.forgotPasswordButtonLabel }}</a>
        </div>
      </v-form>
    </v-card>
    <system-message ref="snackbar"></system-message>
  </v-sheet>
</template>

<script setup>
import { ref, inject, defineProps, defineExpose, computed } from 'vue'

import {useUserStore} from '@/stores/user'
const store = useUserStore()

const controller = inject('argonauth')

import SystemMessage from './SystemMessage.vue';

const emit = defineEmits(['on-step1-success', 'on-step1-failed', 'on-step2-success', 'on-step2-failed'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  
  step1Subtitle: {
    type: String,
    required: false,
    default: ''
  },
  
  step2Subtitle: {
    type: String,
    required: false,
    default: ''
  },
  
  step1SubmitButtonLabel: {
    type: String,
    required: false,
    default: 'Continue'
  },
  
  step2SubmitButtonLabel: {
    type: String,
    required: false,
    default: 'Login'
  },
  
  backButtonLabel: {
    type: String,
    required: false,
    default: 'Back'
  },
  
  registerText: {
    type: String,
    required: false,
    default: ''
  },
  
  registerButtonLabel: {
    type: String,
    required: false,
    default: ''
  },
  
  loginText: {
    type: String,
    required: false,
    default: ''
  },
  
  loginButtonLabel: {
    type: String,
    required: false,
    default: ''
  },
  
  forgotPasswordText: {
    type: String,
    required: false,
    default: ''
  },
  
  forgotPasswordButtonLabel: {
    type: String,
    required: false,
    default: ''
  },

  noSnackBar: {
    type: Boolean,
    required: false,
    default: false
  }
})

defineExpose({ preLogin, login })

const hasRegister = computed(() => {
  return props.registerText && props.registerButtonLabel
})

const snackbar = ref()
const form = ref({
  email: '',
  password: '',
  loading: false
})
const isPasswordVisible = ref(false)

async function preLogin() {
  try {
    form.value.loading = true
    const user = await controller.preLogin(form.value.email)
    store.setPreLoginInfo(user)
    emit('on-step1-success', user)
  } catch (err) {
    store.setPreLoginInfo({id: '', salt: ''})
    let message = err.error ? err.error.message : err
    if (err.code === 404) {
      message = 'User not found or deactivated'
    }
    emit('on-step1-failed', new Error(message))
    if (!props.noSnackBar) {
      snackbar.value.showError(message)
    }
  } finally {
    form.value.loading = false
  }
}

async function login() {
  try {
    form.value.loading = true
    const user = store.preLoginInfo
    user.rawPassword = form.value.password
    const account = await controller.login(user)
    store.setUser(account)
    emit('on-step2-success', account)
  } catch (err) {
    const messages = {
      403: 'Usuário ou senha incorretos',
      423: 'Conta bloqueada'
    }
    let message = err.error ? err.error.message : err
    if (err && err.code) {
      message = messages[err.code] || message
    }
    if (!props.noSnackBar) {
      snackbar.value.showError(message)
    }
    emit('on-step2-failed', new Error(message))
  } finally {
    form.value.loading = false
  }
}

async function logout() {
  try {
    form.value.loading = true
    store.clear()
    await controller.logout()
  } catch (err) {
  } finally {
    form.value.loading = false
  }
}
</script>
