<template>
  <v-form @submit.prevent="onSubmit" ref="formRef" v-model="valid">
    <v-text-field v-model="name" label="Nome" :rules="nameRules" prepend-inner-icon="mdi-account-outline" required class="mb-4" />
    <v-text-field v-model="email" label="Email" type="email" :rules="emailRules" prepend-inner-icon="mdi-email-outline" required class="mb-4" />
    <v-text-field v-model="password" label="Senha" type="password" :rules="passwordRules" prepend-inner-icon="mdi-lock-outline" required class="mb-6" />
    <v-btn type="submit" color="primary" block :disabled="!valid">Cadastrar</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose } from 'vue'

const emit = defineEmits(['submit'])
const name = ref('')
const email = ref('')
const password = ref('')
const valid = ref(false)
const formRef = ref()

const nameRules = [
  (v: string) => !!v || 'Nome é obrigatório',
]
const emailRules = [
  (v: string) => !!v || 'Email é obrigatório',
  (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
]
const passwordRules = [
  (v: string) => !!v || 'Senha é obrigatória',
  (v: string) => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
]

function onSubmit() {
  if (formRef.value?.validate()) {
    emit('submit', { name: name.value, email: email.value, password: password.value })
  }
}

defineExpose({ name, email, password, formRef, valid })
</script>
