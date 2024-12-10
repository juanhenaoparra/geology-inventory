export interface User {
    id: number
    email: string
    name: string
    career?: string
    semester?: string
    student_code?: string
    phone?: string
    role?: string
}

export interface OAuthUser {
    email: string
    name: string
}
