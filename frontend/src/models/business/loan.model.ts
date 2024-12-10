export enum LoanStatus {
    RETURNED = 'devuelto',
    PENDING = 'pendiente',
}

export interface LoanHistory {
    id: number
    user_name: string
    loan_date: string
    return_date: string
    observation: string
    status: LoanStatus
}

export interface LoanData {
    userId: string
    stockId: string
    loanDate: string
    returnDate?: string
    status?: string
    observation?: string
    subject?: string
}
