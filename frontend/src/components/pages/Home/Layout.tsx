import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import StockItemForm from '@/components/pages/Stock/StockItemForm'
import LoanPage from '@/components/pages/Loan/LoanPage'
import StockList from '@/components/pages/Stock/StockList'
import LoansList from '@/components/pages/Loan/LoansList'
import EditStockItemFormWrapper from '@/components/pages/Stock/EditStockFormWrapper'
import Home from '@/components/pages/Home/Home'

const Layout: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <nav className="mb-4">
                <ul className="flex gap-4">
                    <li>
                        <Link to="/home" className="hover:underline">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/stock" className="hover:underline">
                            Stock Form
                        </Link>
                    </li>
                    <li>
                        <Link to="/loan" className="hover:underline">
                            Loan
                        </Link>
                    </li>
                    <li>
                        <Link to="/stockList" className="hover:underline">
                            Stock List
                        </Link>
                    </li>
                </ul>
            </nav>

            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/stock" element={<StockItemForm />} />
                <Route path="/stockList" element={<StockList />} />
                <Route path="/edit-stock/:itemId" element={<EditStockItemFormWrapper />} />
                <Route path="/loans" element={<LoansList />} />
                <Route path="/loan" element={<LoanPage />} />
            </Routes>
        </div>
    )
}

export default Layout 