import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/globalStates/useUserStore'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
    const { user, clearUser } = useUserStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        clearUser()
        navigate('/login')
    }

    useEffect(() => {
        if (!user?.id) {
            navigate('/login')
        }
    }, [user, navigate])

    return (
        <main className='flex justify-between'>
            <section>
                <h1 className="text-2xl font-bold">Bienvenido al Sistema de Inventario</h1>
                <p className="mt-2">Selecciona una opción del menú superior.</p>
            </section>
            <section>
                <Button onClick={handleLogout}>Cerrar Sesión</Button>
            </section>
        </main>
    )
}

export default Home 