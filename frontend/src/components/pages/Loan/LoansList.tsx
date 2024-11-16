import { LoanHistory } from '@/models/business/loan.model'
import Pagination from '@/components/ui/Pagination'
import { useState, useEffect } from 'react'
import { getLoans } from '@/services/LoansServices'

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
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination pagination={pagination} onPaginationChange={handlePaginationChange} />
        </div>
    )
}

export default LoanList
