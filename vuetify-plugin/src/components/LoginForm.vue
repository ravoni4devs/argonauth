<template>
  <!-- eslint-disable vue/no-v-html -->
  <v-sheet class="login-container" rounded elevation="4">
    <v-card class="login-card pa-6" variant="flat" width="500">
      <v-card-item>
        <v-card-title class="text-center text-h4 mb-4">{{ props.title }}</v-card-title>
      </v-card-item>

      <v-form @submit.prevent="preLogin" v-if="!store.isPreLoginDone">
        <v-card-subtitle class="text-center mb-6">
          {{ props.step1.subtitle }}
        </v-card-subtitle>
        <v-text-field
          v-model="form.email"
          label="Email"
          :prepend-inner-icon="props.step1.emailIcon"
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
          {{ props.step1.submitButtonLabel }}
        </v-btn>

        <div class="text-center mt-6" v-if="hasRegister">
          <span class="text-body-2">{{ props.step1.registerText }}</span>
          <a href="#" class="text-decoration-none">{{ props.step1.registerButtonLabel }}</a>
        </div>
      </v-form>
      <v-form v-else-if="store.isPreLoginDone" @submit.prevent="login">
        <v-card-subtitle class="text-center mb-6">
          <div class="d-flex align-center justify-center mb-2">
            <v-icon color="primary" class="mr-2">{{ props.step2.accountIcon }}</v-icon>
            <span>{{ form.email }}</span>
          </div>
          {{ props.step2.subtitle }}
        </v-card-subtitle>
        <v-text-field
          v-model="form.password"
          :append-inner-icon="isPasswordVisible ? props.step2.passwordHiddenIcon : props.step2.passwordVisibleIcon"
          :type="isPasswordVisible ? 'text' : 'password'"
          label="Password"
          :prepend-inner-icon="props.step2.passwordIcon"
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
            {{ props.step2.submitButtonLabel }}
          </v-btn>

          <v-btn
            variant="text"
            :disabled="form.loading"
            block
          >
            {{ props.step2.backButtonLabel }}
          </v-btn>
        </div>

        <div class="text-center mt-6" v-if="props.forgotPassword.text">
          {{ props.forgotPassword.text }}
          <a href="#" class="text-decoration-none">{{ props.forgotPassword.buttonLabel }}</a>
        </div>
      </v-form>
    </v-card>
    <system-message ref="snackbar"></system-message>
  </v-sheet>
</template>

<script setup>
import { ref, inject, defineProps, defineExpose, computed } from 'vue'

import { useUserStore } from '@/stores/user'
const store = useUserStore()

const controller = inject('argonauth')

import SystemMessage from './SystemMessage.vue';

const emit = defineEmits(['on-step1-success', 'on-step1-failed', 'on-step2-success', 'on-step2-failed'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  
  step1: {
    type: Object,
    required: false,
    default: {
      subtitle: '',
      submitButtonLabel: 'Continue',
      registerText: '',
      registerButtonLabel: '',
      emailIcon: 'mdi-email-outline',
    }
  },
  
  step2: {
    type: Object,
    required: false,
    default: {
      subtitle: '',
      submitButtonLabel: 'Login',
      backButtonLabel: 'Back',
      loginText: '',
      loginButtonLabel: '',
      accountIcon: 'mdi-account-circle',
      passwordVisibleIcon: 'mdi-eye',
      passwordHiddenIcon: 'mdi-eye-off',
      passwordIcon: 'mdi-lock-outline',
    }
  },
  
  
  forgotPassword: {
    type: Object,
    required: false,
    default: {
      text: '',
      buttonLabel: ''
    }
  },

  noSnackBar: {
    type: Boolean,
    required: false,
    default: false
  },

  actions: {
    type: Object,
    required: false,
    default: {}
  }
})

defineExpose({ preLogin, login })

const hasRegister = computed(() => {
  const step1 = props.step1 || {}
  return step1.registerText && step1.registerButtonLabel
})

const snackbar = ref()
const form = ref({
  email: '',
  password: '',
  loading: false
})
const isPasswordVisible = ref(false)

async function preLogin() {
  if (props.actions.preLogin) {
    props.actions.preLogin(store, form.value.email)
    return
  }
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
  if (props.actions.login) {
    props.actions.login(store, form.value.password)
    return
  }
  try {
    form.value.loading = true
    const user = store.preLoginInfo
    user.rawPassword = form.value.password
    const account = await controller.login(user)
    store.setUser(account)
    emit('on-step2-success', account)
  } catch (err) {
    const messages = {
      403: 'Wrong email or password',
      423: 'Account is locked'
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
  if (props.actions.logout) {
    props.actions.logout(store)
    return
  }
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
