import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import GoogleIcon from '@/assets/icons/GoogleIcon'

const LoginPage = () => {
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        // Implementar lógica de OAuth con Google
        console.log('Iniciando sesión con Google...')
        // Simular inicio de sesión exitoso y redirigir
        navigate('/home')
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center fixed inset-0">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-2xl font-bold text-slate-800 mb-7">
                        Sistema de Inventario
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-4">
                        Departamento de Geología
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center mb-12 px-4 mt-6">
                        <p className="text-slate-600">
                            Bienvenido al sistema de gestión de inventario del departamento de 
                            geología. Esta plataforma te permite administrar y dar seguimiento 
                            a todos los equipos y préstamos del departamento.
                        </p>
                    </div>
                    <Button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-50 text-slate-800 border border-slate-300 py-6"
                    >
                        <GoogleIcon />
                        Continuar con Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage
