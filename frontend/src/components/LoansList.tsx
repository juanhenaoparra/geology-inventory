import { LoanHistory } from '@/models/business/loan.model'
import { useState, useEffect } from 'react'
import { getLoans } from '@/services/api'

const LoansList: React.FC = () => {
    const [loans, setLoans] = useState<LoanHistory[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)

    useEffect(() => {
        getLoans(currentPage, pageSize).then((data) => {
            console.log(data)
            setLoans(data.items)
            setTotalItems(data.total)
            setTotalPages(data.pages)
            setHasNext(data.has_next)
            setHasPrev(data.has_prev)
        })
    }, [currentPage, pageSize])

    const nextPage = () => {
        if (hasNext) {
            setCurrentPage((prev) => prev + 1)
        }
    }

    const previousPage = () => {
        if (hasPrev) {
            setCurrentPage((prev) => prev - 1)
        }
    }

    const changePage = (page: number) => {
        setCurrentPage(page)
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

                {/* Pagination */}
                <div className="w-full  flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
                    <div className="text-lg">
                        Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
                        {Math.min(currentPage * pageSize, totalItems)} de {totalItems} entradas
                    </div>
                    <div className="flex">
                        <nav>
                            <ul className="flex justify-center items-center gap-x-[10px] z-30">
                                <li>
                                    <button
                                        className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                                            !hasPrev
                                                ? 'bg-[#cccccc] pointer-events-none'
                                                : ' cursor-pointer'
                                        }`}
                                        onClick={previousPage}
                                        disabled={!hasPrev}
                                    >
                                        <img
                                            src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg"
                                            alt="Previous page"
                                        />
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => changePage(index + 1)}
                                            className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                                                currentPage == index
                                                    ? 'text-blue-600  border-sky-500'
                                                    : 'border-[#E4E4EB] '
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                                            !hasNext
                                                ? 'bg-[#cccccc] pointer-events-none'
                                                : ' cursor-pointer'
                                        }`}
                                        onClick={nextPage}
                                        disabled={!hasNext}
                                    >
                                        <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoansList
