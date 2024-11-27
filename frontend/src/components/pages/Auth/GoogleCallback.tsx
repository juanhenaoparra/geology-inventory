import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getGoogleUserInfo } from '@/services/AuthService'

const GoogleCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(true)

    useEffect(() => {
        const processCallback = async () => {
            try {
                const code = searchParams.get('code')
                if (!code) {
                    throw new Error('No se recibió el código de autorización')
                }

                const userInfo = await getGoogleUserInfo(code)
                console.log('Información del usuario:', userInfo)
                
                navigate('/home')
            } catch (error) {
                console.error('Error en el callback:', error)
                navigate('/login')
            } finally {
                setIsProcessing(false)
            }
        }

        processCallback()
    }, [searchParams, navigate])

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
