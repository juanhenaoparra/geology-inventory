import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/components/pages/Auth/LoginPage'
import Layout from '@/components/pages/Home/Layout'
import GoogleCallback from '@/components/pages/Auth/GoogleCallback'
import RegisterPage from '@/components/pages/Auth/RegisterPage'
import CreateLoan from '@/components/pages/Loan/CreateLoan'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/*" element={<Layout />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/create-loan" element={<CreateLoan />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
