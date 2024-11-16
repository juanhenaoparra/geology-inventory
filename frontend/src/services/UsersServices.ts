import { USERS_API_HOST } from './api'

export interface User {
    id: number
    name: string
    email: string
}

// Función para obtener usuarios
export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${USERS_API_HOST}`)
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios')
        }
        return response.json()
    } catch (error) {
        console.error('Error:', error)
        return []
    }
}
