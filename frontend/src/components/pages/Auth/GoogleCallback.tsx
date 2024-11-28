import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getGoogleUserInfo } from '@/services/AuthService'
import { registerUser } from '@/services/UsersServices'
import { useUserStore } from '@/globalStates/useUserStore'

const GoogleCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(true)
    const setUser = useUserStore((state) => state.setUser)

    useEffect(() => {
        const processCallback = async () => {
            try {
                const code = searchParams.get('code')
                if (!code) {
                    throw new Error('No se recibió el código de autorización')
                }

                const googleUserInfo = await getGoogleUserInfo(code)
                
                // Registrar el usuario en el backend
                const oauthUser = {
                    email: googleUserInfo.email,
                    name: googleUserInfo.given_name + ' ' + googleUserInfo.family_name,
                }
                
                const registeredUser = await registerUser(oauthUser)
                
                // Guardar el usuario en el estado global
                setUser(registeredUser)
                
                navigate('/home')
            } catch (error) {
                console.error('Error en el callback:', error)
                navigate('/login')
            } finally {
                setIsProcessing(false)
            }
        }

        processCallback()
    }, [searchParams, navigate, setUser])

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
