import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import StockItemForm from '@/components/pages/Stock/StockItemForm'
import LoanPage from '@/components/pages/Loan/LoanPage'
import StockList from '@/components/pages/Stock/StockList'
import LoansList from '@/components/pages/Loan/LoansList'
import EditStockItemFormWrapper from '@/components/pages/Stock/EditStockFormWrapper'
import Home from '@/components/pages/Home/Home'
import CreateLoanPage from '@/components/pages/Loan/CreateLoan'
import { useUserStore } from '@/globalStates/useUserStore'
import { Button } from '@/components/ui/button'

const Layout: React.FC = () => {
    const { user, clearUser } = useUserStore()
    const navigate = useNavigate()
    const isAdmin = user.role === 'admin'

    const handleLogout = () => {
        clearUser()
        navigate('/login')
    }

    return (
        <div className="container mx-auto p-4">
            <nav className="mb-4 flex justify-between items-center">
                <ul className="flex gap-4">
                    <li>
                        <Link to="/home" className="hover:underline">
                            Inicio
                        </Link>
                    </li>
                    {isAdmin && (
                        <>
                            <li>
                                <Link to="/stock" className="hover:underline">
                                    Agregar herramienta
                                </Link>
                            </li>
                            <li>
                                <Link to="/stockList" className="hover:underline">
                                    Inventario de herramientas
                                </Link>
                            </li>
                        </>
                    )}
                    <li>
                        <Link to="/loans" className="hover:underline">
                            Préstamos
                        </Link>
                    </li>
                    {user.role === 'student' && (
                        <li>
                            <Link to="/create-loan" className="hover:underline">
                                Crear préstamo
                            </Link>
                        </li>
                    )}
                </ul>
                <Button onClick={handleLogout} variant="destructive">
                    Cerrar Sesión
                </Button>
            </nav>

            <Routes>
                <Route path="/home" element={<Home />} />
                {isAdmin && (
                    <>
                        <Route path="/stock" element={<StockItemForm />} />
                        <Route path="/stockList" element={<StockList />} />
                        <Route path="/edit-stock/:itemId" element={<EditStockItemFormWrapper />} />
                    </>
                )}
                <Route path="/loans" element={<LoansList />} />
                <Route path="/loan" element={<LoanPage />} />
                {user.role === 'student' && (
                    <Route path="/create-loan" element={<CreateLoanPage />} />
                )}
            </Routes>
        </div>
    )
}

export default Layout
