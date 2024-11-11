// src/api/ToolsServices.ts

export interface Tool {
    id: number
    name: string
    available: boolean
}

export interface User {
    id: number
    name: string
    email: string
}

export interface LoanData {
    userId: string
    toolId: string
    loanDate: string
    returnDate?: string
    status: string
    observation?: string
}

// Función para obtener herramientas
export async function fetchTools(): Promise<Tool[]> {
    try {
        const response = await fetch('http://localhost:8000/api/tools')
        if (!response.ok) {
            throw new Error('Error al obtener las herramientas')
        }
        return response.json()
    } catch (error) {
        console.error('Error:', error)
        return []
    }
}

// Función para obtener usuarios
export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch('http://localhost:8000/api/users')
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios')
        }
        return response.json()
    } catch (error) {
        console.error('Error:', error)
        return []
    }
}

// Función para registrar un préstamo
export async function submitLoan(loanData: LoanData): Promise<void> {
    try {
        const response = await fetch('http://localhost:8000/api/loans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loanData),
        })
        if (!response.ok) {
            throw new Error('Error al registrar el préstamo')
        }
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}
