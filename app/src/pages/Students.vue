<template>
    <v-container class="py-8">
        <v-card class="pa-6" elevation="4">
            <v-card-title class="text-h5 font-weight-bold mb-4 d-flex justify-space-between align-center">
                <span>Lista de Estudantes</span>
                <v-btn color="primary" class="ml-auto" @click="goToCreate">Cadastrar +</v-btn>
            </v-card-title>
            <v-data-table-virtual :headers="headers" :items="students" class="elevation-1" item-key="id" :height="500">
                <template #item.ra="{ item }">
                    {{ item.ra || '-' }}
                </template>
                <template #item.name="{ item }">
                    {{ item.name }}
                </template>
                <template #item.email="{ item }">
                    {{ item.email }}
                </template>
                <template #item.cpf="{ item }">
                    {{ item.cpf }}
                </template>
                <template #item.acoes="{ item }">
                    <v-btn color="info" size="small" class="mr-2" @click="goToEdit(item.id)">Atualizar</v-btn>
                    <v-btn color="error" size="small" @click="removeStudent(item.id)">Remover</v-btn>
                </template>
            </v-data-table-virtual>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToEdit = (id: number) => {
    router.push(`/edit-student/${id}`)
}

const goToCreate = () => {
    router.push('/create-student')
}

async function removeStudent(id: number) {
    if (!confirm('Tem certeza que deseja remover este estudante?')) return;
    try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3333/students/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (!response.ok) throw new Error('Erro ao remover estudante')
        students.value = students.value.filter(s => s.id !== id)
    } catch (err) {
        alert('Erro ao remover estudante')
    }
}

const students = ref<Array<{ id: number, name: string, email: string, ra?: string }>>([])
const headers = [
    { title: 'Registro de matrícula', key: 'ra', width: 200 },
    { title: 'Nome', key: 'name', width: 200 },
    { title: 'Email', key: 'email', width: 250 },
    { title: 'CPF', key: 'cpf', width: 250 },
    { title: 'Ações', key: 'acoes', width: 250 },
]

onMounted(async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3333/students', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (!response.ok) throw new Error('Erro ao buscar students')
        students.value = await response.json()

        console.log(students)
    } catch (err) {
        students.value = []
    }
})
</script>
