'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import CreateLoanModal from './CreateLoanModal'
import LoanList from './LoansList'

const LoanPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false)

    const handleModalOpen = () => {
        setShowModal(true)
    }

    const handleModalClose = () => {
        setShowModal(false)
    }

    const handleLoanCreated = () => {
        // Optionally refresh data or provide feedback after a loan is created
        setShowModal(false)
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Loan Management</h1>
                <CreateLoanModal onLoanCreated={handleLoanCreated} />
            </header>

            <section>
                <LoanList />
            </section>
        </div>
    )
}

export default LoanPage
