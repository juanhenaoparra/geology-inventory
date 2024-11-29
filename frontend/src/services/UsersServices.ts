import { USERS_API_HOST } from './api'
import { OAuthUser, User } from '@/models/business/user.model'

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

export async function registerUser(userData: OAuthUser): Promise<User> {
    try {
        const response = await fetch(`${USERS_API_HOST}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            throw new Error('Error al registrar el usuario')
        }

        return response.json()
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}
