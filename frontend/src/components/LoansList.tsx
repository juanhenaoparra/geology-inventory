import { LoanHistory } from '@/models/business/loan.model'
import Pagination from '@/components/ui/Pagination'
import { useState, useEffect } from 'react'
import { getLoans } from '@/services/api'

const LoansList: React.FC = () => {
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
    }

    return (
        <div className="h-full bg-white flex items-center justify-center pt-10 pb-14">
            <div className="w-full px-2">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-medium">Historial de Préstamos</h1>
                </div>

                <div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none mt-2">
                    <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
                        {/* Table header */}
                        <thead className="rounded-lg text-base text-white font-semibold w-full">
                            <tr className="bg-[#222E3A]/[6%]">
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    N°
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Persona
                                </th>
                                <th className="py-3 px-3  justify-center gap-1 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Fecha préstamo
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Fecha devolución
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Descripción
                                </th>
                                <th className="flex items-center py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap gap-1">
                                    Estado
                                </th>
                            </tr>
                        </thead>

                        {/* Table body */}
                        <tbody>
                            {loans?.map((data, index) => (
                                <tr
                                    className={`${
                                        index % 2 == 0 ? 'bg-white' : 'bg-[#222E3A]/[6%]'
                                    }`}
                                    key={index}
                                >
                                    <td
                                        className={`py-2 px-3 font-normal text-base ${
                                            index == 0
                                                ? 'border-t-2 border-black'
                                                : index == loans?.length
                                                ? 'border-y'
                                                : 'border-t'
                                        } whitespace-nowrap`}
                                    >
                                        {data?.id}
                                    </td>
                                    <td
                                        className={`py-2 px-3 font-normal text-base ${
                                            index == 0
                                                ? 'border-t-2 border-black'
                                                : index == loans?.length
                                                ? 'border-y'
                                                : 'border-t'
                                        } whitespace-nowrap`}
                                    >
                                        {data?.user_name}
                                    </td>
                                    <td
                                        className={`py-2 px-3 font-normal text-base ${
                                            index == 0
                                                ? 'border-t-2 border-black'
                                                : index == loans?.length
                                                ? 'border-y'
                                                : 'border-t'
                                        } whitespace-nowrap`}
                                    >
                                        {data?.loan_date}
                                    </td>
                                    <td
                                        className={`py-2 px-3 text-base  font-normal ${
                                            index == 0
                                                ? 'border-t-2 border-black'
                                                : index == loans?.length
                                                ? 'border-y'
                                                : 'border-t'
                                        } whitespace-nowrap`}
                                    >
                                        {data?.return_date}
                                    </td>
                                    <td
                                        className={`py-2 px-3 text-base  font-normal ${
                                            index == 0
                                                ? 'border-t-2 border-black'
                                                : index == loans?.length
                                                ? 'border-y'
                                                : 'border-t'
                                        } min-w-[250px]`}
                                    >
                                        {data?.observation}
                                    </td>
                                    <td
                                        className={`py-5 px-4 text-base  font-normal ${
                                            index == 0
                                                ? 'border-t-2 border-black'
                                                : index == loans?.length
                                                ? 'border-y'
                                                : 'border-t'
                                        }`}
                                    >
                                        {data?.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination pagination={pagination} onPaginationChange={handlePaginationChange} />
            </div>
        </div>
    )
}
export default LoansList
