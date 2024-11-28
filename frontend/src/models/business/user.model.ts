export interface User {
    id: number
    email: string
    name: string
    career?: string
    subject?: string
    semester?: number
    student_code?: string
    phone?: string
}

export interface OAuthUser {
    email: string
    name: string
}

