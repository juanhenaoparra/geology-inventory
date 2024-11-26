import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/components/pages/Auth/LoginPage'
import Layout from '@/components/pages/Home/Layout'
import GoogleCallback from '@/components/pages/Auth/GoogleCallback'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/*" element={<Layout />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
