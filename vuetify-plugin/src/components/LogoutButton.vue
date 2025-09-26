<template>
  <v-btn
    ref="btnRef"
    v-bind="attrs"
    v-on="listeners"
    @click="onClick"
  >
    <slot>Logout</slot>
  </v-btn>
</template>

<script setup>
import { ref, useAttrs, getCurrentInstance, inject } from 'vue'
import { VBtn } from 'vuetify/components'

import {useUserStore} from '@/stores/user'
const store = useUserStore()

const service = inject('argonAuthService')

const emit = defineEmits(['on-success', 'on-failed'])
const attrs = useAttrs()
const btnRef = ref(null)

const instance = getCurrentInstance()

const listeners = {}
Object.entries(instance.vnode.props || {}).forEach(([key, value]) => {
  if (key.startsWith('on') && key.toLowerCase() !== 'onclick') {
    listeners[key] = value
  }
})

const onClick = async (e) => {
  if (attrs.onClick) attrs.onClick(e)
  try {
    await service.logout()
    store.clear()
    emit('on-success')
  } catch(err) {
    emit('on-failed', err)
  }
}
</script>

