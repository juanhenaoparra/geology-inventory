import React, { useEffect } from 'react'
import { useUserStore } from '@/globalStates/useUserStore'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
    const { user } = useUserStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user?.id) {
            navigate('/login')
        }
    }, [user, navigate])

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-3xl font-bold text-blue-600">
                Bienvenido, {user?.name || 'Usuario'}
            </h1>
            <p className="mt-4 text-lg text-gray-700">
                Este es el Sistema de Inventario. Usa las opciones del menú superior para navegar.
            </p>
        </main>
    )
}

export default Home
