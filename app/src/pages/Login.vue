<template>
    <v-container class="fill-height" max-width="400" justify="center" align="center">
        <v-row justify="center">
            <v-col cols="12">
                <v-card class="pa-6" rounded="lg" elevation="8">
                    <v-card-title class="text-h5 font-weight-bold text-center mb-4">Login</v-card-title>
                    <LoginForm @submit="onLogin" ref="loginFormRef" />
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
import LoginForm from '../components/LoginForm.vue'

const loginFormRef = ref()
const router = useRouter()

async function onLogin({ email, password }: { email: string, password: string }) {
    try {
        const response = await fetch('http://localhost:3333/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
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
</script>

<style scoped>
.v-card {
    max-width: 400px;
    margin: auto;
}
</style>
