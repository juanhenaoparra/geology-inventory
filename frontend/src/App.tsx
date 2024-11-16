import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StockItemForm from '@/components/pages/StockItemForm'
import LoanPage from '@/components/pages/LoanPage'
import StockList from '@/components/pages/StockList'
import LoansList from '@/components/LoansList'
import EditStockItemFormWrapper from './components/pages/EditStockFormWrapper'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="container mx-auto p-4">
                {/* Navigation */}
                <nav className="mb-4">
                    <ul className="flex gap-4">
                        <li>
                            <Link to="/" className="hover:underline">
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
                        <li>
                            <Link to="/loans" className="hover:underline">
                                Préstamos
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/stock" element={<StockItemForm />} />

                    <Route path="/stockList" element={<StockList />} />
                    <Route path="/edit-stock/:itemId" element={<EditStockItemFormWrapper />} />

                    <Route path="/loans" element={<LoansList />} />

                    <Route path="/loan" element={<LoanPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

// Simple Home component
const Home: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Welcome to Geology Inventory</h1>
            <p className="mt-2">Select an option from the navigation above.</p>
        </div>
    )
}

export default App
