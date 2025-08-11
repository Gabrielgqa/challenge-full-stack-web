<template>
  <v-container class="fill-height" max-width="400" justify="center" align="center">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-6" rounded="lg" elevation="8">
          <v-card-title class="text-h5 font-weight-bold text-center mb-4">Cadastro de Usuário</v-card-title>
          <RegisterForm @submit="onRegister" ref="registerFormRef" />
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'

const registerFormRef = ref()
const router = useRouter()

async function onRegister({ name, email, password }: { name: string, email: string, password: string }) {
  try {
    const response = await fetch('http://localhost:3333/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Erro ao cadastrar usuário')
    }
    alert('Usuário cadastrado com sucesso!')
    registerFormRef.value?.formRef?.resetValidation()
    router.push('/login')
  } catch (err: any) {
    alert(err.message || 'Erro desconhecido ao cadastrar')
  }
}
</script>
