<template>
    <v-container class="fill-height" max-width="400" justify="center" align="center">
        <v-row justify="center">
            <v-col cols="12">
                <v-card class="pa-6" rounded="lg" elevation="8">
                    <v-card-title class="text-h5 font-weight-bold text-center mb-4">Login</v-card-title>
                    <v-form @submit.prevent="onLogin" ref="loginForm" v-model="valid">
                        <v-text-field v-model="email" label="Email" type="email" :rules="emailRules"
                            prepend-inner-icon="mdi-email-outline" required class="mb-4" />
                        <v-text-field v-model="password" label="Senha" type="password" :rules="passwordRules"
                            prepend-inner-icon="mdi-lock-outline" required class="mb-6" />
                        <v-btn type="submit" color="primary" block :disabled="!valid">Entrar</v-btn>
                    </v-form>
                    <div class="text-center mt-4">
                        <p>ou</p>
                        <router-link to="/" class="text-primary text-decoration-underline">
                            Criar a conta
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


const email = ref('')
const password = ref('')
const valid = ref(false)
const loginForm = ref()
const router = useRouter()

const emailRules = [
    (v: string) => !!v || 'Email é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
]
const passwordRules = [
    (v: string) => !!v || 'Senha é obrigatória',
    (v: string) => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
]

async function onLogin() {
    if (loginForm.value?.validate()) {
        try {
            const response = await fetch('http://localhost:3333/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Erro ao fazer login')
            }
            const data = await response.json()
            if (data.token) {
                localStorage.setItem('token', data.token)
                router.push('/students')
            }
        } catch (err: any) {
            alert(err.message || 'Erro desconhecido ao fazer login')
        }
    }
}
</script>

<style scoped>
.v-card {
    max-width: 400px;
    margin: auto;
}
</style>
