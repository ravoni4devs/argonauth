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
        @on-step2-success="welcome"
      />
  </v-container>
</template>

<script setup>
import { ref, inject } from 'vue'

import {
  VSheet,
  VForm, VTextField, VBtn, VIcon,
  VCard, VCardItem, VCardTitle, VCardSubtitle, VCardText
} from 'vuetify/components';

const user = ref({})

function welcome(account) {
  user.value = account.user
}

function bye() {
  user.value = {}
}
</script>
