<template>
  <v-snackbar
    v-model="visible"
    :timeout="timeout"
    :color="color"
    multi-line
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="visible = false"
        icon="mdi-close-circle"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import {ref} from 'vue'
const visible = ref(false)
const text = ref('')
const timeout = ref(2000)
const color = ref('success')

function showError(err, extra = {}) {
  text.value = typeof (err) === 'string' ? err : err.message
  timeout.value = extra.timeout && extra.timeout > 0 ? extra.timeout : 5000
  color.value = extra.color && extra.color !== '' ? extra.color : 'error'
  visible.value = true
}

function showSuccess(msg, extra = {}) {
  text.value = msg
  timeout.value = extra.timeout && extra.timeout > 0 ? extra.timeout : 5000
  color.value = extra.color && extra.color !== '' ? extra.color : 'success'
  visible.value = true
}
defineExpose({showError, showSuccess})
</script>
