<template>
    <v-container class="fill-height" max-width="400" justify="center" align="center">
        <v-row justify="center">
            <v-col cols="12">
                <v-card class="pa-6" rounded="lg" elevation="8">
                    <v-card-title class="text-h5 font-weight-bold text-center mb-4">Editar Estudante</v-card-title>
                    <v-form @submit.prevent="onUpdate" ref="editForm" v-model="valid">
                        <v-text-field v-model="name" label="Nome" :rules="nameRules"
                            prepend-inner-icon="mdi-account-outline" required class="mb-4" />
                        <v-text-field v-model="email" label="Email" type="email" :rules="emailRules"
                            prepend-inner-icon="mdi-email-outline" required class="mb-6" />
                        <v-btn type="submit" color="primary" block :disabled="!valid">Salvar</v-btn>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params?.id ?? ''
const name = ref('')
const email = ref('')
const valid = ref(false)
const editForm = ref()

const nameRules = [
    (v: string) => !!v || 'Nome é obrigatório',
]
const emailRules = [
    (v: string) => !!v || 'Email é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
]

onMounted(async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3333/students/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (!response.ok) throw new Error('Erro ao buscar estudante')
        const student = await response.json()
        name.value = student.name
        email.value = student.email
    } catch (err) {
        alert('Erro ao carregar estudante')
        router.push('/students')
    }
})

async function onUpdate() {
    if (editForm.value?.validate()) {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3333/students/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                }),
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Erro ao atualizar estudante')
            }
            router.push('/students')
        } catch (err: any) {
            alert(err.message || 'Erro desconhecido ao atualizar')
        }
    }
}
</script>
