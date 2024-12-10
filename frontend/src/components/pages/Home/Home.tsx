import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUserStore } from '@/globalStates/useUserStore'
import { Card } from '@/components/ui/card'

const Home: React.FC = () => {
    const { user } = useUserStore()
    const navigate = useNavigate()
    const isAdmin = user.role === 'admin'
    const isStudent = user.role === 'student'

    useEffect(() => {
        if (!user?.id) {
            navigate('/login')
        }
    }, [user, navigate])

    return (
        <main className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">
                    Bienvenido, <span className="text-blue-600">{user.name}</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isAdmin && (
                    <>
                        <CardLink
                            to="/stock"
                            imgSrc="/assets/icons/add_stock.png"
                            title="Agregar herramienta"
                            description="Añade nuevas herramientas al inventario."
                        />
                        <CardLink
                            to="/stockList"
                            imgSrc="/assets/icons/stock_list.png"
                            title="Inventario de herramientas"
                            description="Administra y revisa el inventario de herramientas disponibles."
                        />
                    </>
                )}
                <CardLink
                    to="/loans"
                    imgSrc="/assets/icons/loan_list.png"
                    title="Préstamos"
                    description="Consulta los préstamos realizados y su estado."
                />
                {isStudent && (
                    <CardLink
                        to="/create-loan"
                        imgSrc="/assets/icons/add_loan.png"
                        title="Crear préstamo"
                        description="Registra un nuevo préstamo para herramientas."
                    />
                )}
            </div>
        </main>
    )
}

interface CardLinkProps {
    to: string
    imgSrc: string
    title: string
    description: string
}

const CardLink: React.FC<CardLinkProps> = ({ to, imgSrc, title, description }) => (
    <Link to={to} className="hover:shadow-lg">
        <Card className="h-full p-4 flex flex-col items-center">
            <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                <img src={imgSrc} alt={title} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </Card>
    </Link>
)

export default Home
