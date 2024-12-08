'use client'

import LoanList from './LoansList'

const LoanPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Loan Management</h1>
            </header>

            <section>
                <LoanList />
            </section>
        </div>
    )
}

export default LoanPage
