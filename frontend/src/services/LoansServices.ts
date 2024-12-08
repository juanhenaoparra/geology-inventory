import { LOANS_API_HOST } from './api'
import { LoanHistory, LoanData, LoanStatus } from '@models/business/loan.model'

interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    page_size: number
    pages: number
    has_next: boolean
    has_prev: boolean
}

// Función para registrar un préstamo
export async function submitLoan(loanData: LoanData): Promise<void> {
    try {
        const response = await fetch(`${LOANS_API_HOST}`, {
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

export const updateLoanStatus = async (loanId: number, status: LoanStatus) => {
    try {
        const response = await fetch(`${LOANS_API_HOST}/${loanId}/status/${status}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error('Error al registrar la devolución')
        }
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

export const getLoans = async (
    userId: number,
    userRole: string,
    page: number = 1,
    pageSize: number = 10,
): Promise<PaginatedResponse<LoanHistory>> => {
    const queryParams = new URLSearchParams({
        user_id: userId.toString(),
        user_role: userRole,
        page: page.toString(),
        page_size: pageSize.toString(),
    })

    const response = await fetch(`${LOANS_API_HOST}?${queryParams}`)
    if (!response.ok) {
        throw new Error('Error al obtener los préstamos')
    }
    return await response.json()
}
