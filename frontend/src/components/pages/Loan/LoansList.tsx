import { LoanHistory, LoanStatus } from '@/models/business/loan.model'
import Pagination from '@/components/ui/Pagination'
import { useState, useEffect } from 'react'
import { getLoans, updateLoanStatus } from '@/services/LoansServices'

interface LoanListProps {
    onPaginationChange?: (newPage: number) => void
}

const LoanList: React.FC<LoanListProps> = ({ onPaginationChange }) => {
    const [loans, setLoans] = useState<LoanHistory[]>([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    })

    useEffect(() => {
        getLoans(pagination.currentPage, pagination.pageSize).then((data) => {
            setLoans(data.items)
            setPagination((prev) => ({
                ...prev,
                totalItems: data.total,
                totalPages: data.pages,
                hasNext: data.has_next,
                hasPrev: data.has_prev,
            }))
        })
    }, [pagination.currentPage, pagination.pageSize])

    const handlePaginationChange = (newPage: number) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }))
        onPaginationChange?.(newPage)
    }

    const handleStatusUpdate = async (loanId: number) => {
        try {
            await updateLoanStatus(loanId, LoanStatus.RETURNED)
            const data = await getLoans(pagination.currentPage, pagination.pageSize)
            setLoans(data.items)
        } catch (error) {
            console.error('Failed to update loan status:', error)
        }
    }

    return (
        <div>
            <table className="table-auto w-full text-left font-inter border">
                <thead>
                    <tr className="bg-gray-200">
                        <th>N°</th>
                        <th>Persona</th>
                        <th>Fecha Préstamo</th>
                        <th>Fecha Devolución</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map((data, index) => (
                        <tr key={data.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                            <td>{data.id}</td>
                            <td>{data.user_name}</td>
                            <td>{data.loan_date}</td>
                            <td>{data.return_date}</td>
                            <td>{data.observation}</td>
                            <td>{data.status}</td>
                            <td>
                                {data.status !== LoanStatus.RETURNED && (
                                    <button
                                        onClick={() => handleStatusUpdate(data.id)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                                    >
                                        Marcar como devuelto
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination pagination={pagination} onPaginationChange={handlePaginationChange} />
        </div>
    )
}

export default LoanList
