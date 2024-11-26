import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleGoogleCallback } from '@/services/AuthService'
import { useToast } from '@/hooks/use-toast'

const GoogleCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [isProcessing, setIsProcessing] = useState(true)

    useEffect(() => {
        const processCallback = async () => {
            try {
                const code = searchParams.get('code')
                if (!code) {
                    throw new Error('No se recibió el código de autorización')
                }

                const token = await handleGoogleCallback(code)
                console.log('Token recibido:', token)
                
                // Aquí puedes guardar el token en localStorage si lo necesitas
                localStorage.setItem('auth_token', token)

                toast({
                    title: 'Éxito',
                    description: 'Inicio de sesión exitoso',
                    duration: 3000,
                })

                navigate('/home')
            } catch (error) {
                console.error('Error en el callback:', error)
                toast({
                    title: 'Error',
                    description: 'Error al procesar la autenticación',
                    variant: 'destructive',
                    duration: 3000,
                })
                navigate('/login')
            } finally {
                setIsProcessing(false)
            }
        }

        processCallback()
    }, [searchParams, navigate, toast])

    if (isProcessing) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <p className="text-lg">Procesando autenticación...</p>
            </div>
        )
    }

    return null
}

export default GoogleCallback
