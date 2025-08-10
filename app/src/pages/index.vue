<template>
  <v-container class="fill-height" max-width="400" justify="center" align="center">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-6" rounded="lg" elevation="8">
          <v-card-title class="text-h5 font-weight-bold text-center mb-4">Cadastro de Usuário</v-card-title>
          <v-form @submit.prevent="onRegister" ref="registerForm" v-model="valid">
            <v-text-field v-model="name" label="Nome" :rules="nameRules" prepend-inner-icon="mdi-account-outline"
              required class="mb-4" />
            <v-text-field v-model="email" label="Email" type="email" :rules="emailRules"
              prepend-inner-icon="mdi-email-outline" required class="mb-4" />
            <v-text-field v-model="password" label="Senha" type="password" :rules="passwordRules"
              prepend-inner-icon="mdi-lock-outline" required class="mb-6" />
            <v-btn type="submit" color="primary" block :disabled="!valid">Cadastrar</v-btn>
          </v-form>
          <div class="text-center mt-4">
            <p>ou</p>
            <router-link to="/login" class="text-primary text-decoration-underline">
              Entrar na conta
            </router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const name = ref('')
const email = ref('')
const password = ref('')
const valid = ref(false)
const registerForm = ref()
const router = useRouter()

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

async function onRegister() {
  if (registerForm.value?.validate()) {
    try {
      const response = await fetch('http://localhost:3333/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao cadastrar usuário')
      }
      alert('Usuário cadastrado com sucesso!')
      name.value = ''
      email.value = ''
      password.value = ''
      registerForm.value.resetValidation()
      router.push('/login')
    } catch (err: any) {
      alert(err.message || 'Erro desconhecido ao cadastrar')
    }
  }
}
</script>
