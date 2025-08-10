<template>
    <v-container class="fill-height" max-width="400" justify="center" align="center">
        <v-row justify="center">
            <v-col cols="12">
                <v-card class="pa-6" rounded="lg" elevation="8">
                    <v-card-title class="text-h5 font-weight-bold text-center mb-4">Cadastrar Estudante</v-card-title>
                    <v-form @submit.prevent="onRegister" ref="registerForm" v-model="valid">
                        <v-text-field v-model="name" label="Nome" :rules="nameRules"
                            prepend-inner-icon="mdi-account-outline" required class="mb-4" />
                        <v-text-field v-model="email" label="Email" type="email" :rules="emailRules"
                            prepend-inner-icon="mdi-email-outline" required class="mb-4" />
                        <v-text-field v-model="cpf" label="CPF" :rules="cpfRules"
                            prepend-inner-icon="mdi-card-account-details-outline" required class="mb-6" />
                        <v-btn type="submit" color="primary" block :disabled="!valid">Cadastrar</v-btn>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const cpf = ref('')
const valid = ref(false)
const registerForm = ref()

const nameRules = [
    (v: string) => !!v || 'Nome é obrigatório',
]
const emailRules = [
    (v: string) => !!v || 'Email é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
]
const cpfRules = [
    (v: string) => !!v || 'CPF é obrigatório',
    (v: string) => v.length === 11 || 'CPF deve ter 11 dígitos',
]

async function onRegister() {
    if (registerForm.value?.validate()) {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3333/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    cpf: cpf.value,
                }),
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Erro ao cadastrar estudante')
            }
            router.push('/students')
        } catch (err: any) {
            alert(err.message || 'Erro desconhecido ao cadastrar')
        }
    }
}
</script>
