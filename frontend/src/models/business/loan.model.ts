export interface LoanHistory {
    id: number
    status: string
    loan_date: string
    return_date: string
    observation: string
    user_name: string
}

export interface LoanData {
    userId: string
    stockId: string
    loanDate: string
    returnDate?: string
    status: string
    observation?: string
}
