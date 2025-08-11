<template>
  <v-form @submit.prevent="onSubmit" ref="formRef" v-model="valid">
    <v-text-field v-model="email" label="Email" type="email" :rules="emailRules" prepend-inner-icon="mdi-email-outline" required class="mb-4" />
    <v-text-field v-model="password" label="Senha" type="password" :rules="passwordRules" prepend-inner-icon="mdi-lock-outline" required class="mb-6" />
    <v-btn type="submit" color="primary" block :disabled="!valid">Entrar</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose } from 'vue'

const emit = defineEmits(['submit'])
const email = ref('')
const password = ref('')
const valid = ref(false)
const formRef = ref()

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
    emit('submit', { email: email.value, password: password.value })
  }
}

defineExpose({ email, password, formRef, valid })
</script>
