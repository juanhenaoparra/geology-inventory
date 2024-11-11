import { LoanHistory } from '@/models/business/loan.model'
import { useState, useMemo, useEffect } from 'react'
import { getLoans } from '@/services/api'

const LoansList: React.FC = () => {
    const [loans, setLoans] = useState<LoanHistory[]>([])
    const [rowsLimit] = useState(6)
    const [rowsToShow, setRowsToShow] = useState(loans.slice(0, rowsLimit))
    const [customPagination, setCustomPagination] = useState<number[]>([])
    const [totalPage, setTotalPage] = useState(Math.ceil(loans?.length / rowsLimit))
    const [currentPage, setCurrentPage] = useState(0)

    const nextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1)
        const endIndex = startIndex + rowsLimit
        const newArray = loans.slice(startIndex, endIndex)
        setRowsToShow(newArray)
        setCurrentPage(currentPage + 1)
    }

    const changePage = (value: number) => {
        const startIndex = value * rowsLimit
        const endIndex = startIndex + rowsLimit
        const newArray = loans.slice(startIndex, endIndex)
        setRowsToShow(newArray)
        setCurrentPage(value)
    }

    const previousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit
        const endIndex = startIndex + rowsLimit
        const newArray = loans.slice(startIndex, endIndex)
        setRowsToShow(newArray)
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        } else {
            setCurrentPage(0)
        }
    }

    useEffect(() => {
        getLoans().then((data) => {
            setLoans(data)
            setTotalPage(Math.ceil(data?.length / rowsLimit))
            setRowsToShow(data.slice(0, rowsLimit))
        })
    }, [])

    useMemo(() => {
        setCustomPagination(Array(Math.ceil(loans?.length / rowsLimit)).fill(null))
    }, [loans])
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
                            {rowsToShow?.map((data, index) => (
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
                                                : index == rowsToShow?.length
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
                                                : index == rowsToShow?.length
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
                                                : index == rowsToShow?.length
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
                                                : index == rowsToShow?.length
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
                                                : index == rowsToShow?.length
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
                                                : index == rowsToShow?.length
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
                        Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{' '}
                        {currentPage == totalPage - 1
                            ? loans?.length
                            : (currentPage + 1) * rowsLimit}{' '}
                        of {loans?.length} entries
                    </div>
                    <div className="flex">
                        <ul
                            className="flex justify-center items-center gap-x-[10px] z-30"
                            role="navigation"
                            aria-label="Pagination"
                        >
                            <li
                                className={` prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                                    currentPage == 0
                                        ? 'bg-[#cccccc] pointer-events-none'
                                        : ' cursor-pointer'
                                }
  `}
                                onClick={previousPage}
                            >
                                <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                            </li>
                            {customPagination?.map((data, index) => (
                                <li
                                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                                        currentPage == index
                                            ? 'text-blue-600  border-sky-500'
                                            : 'border-[#E4E4EB] '
                                    }`}
                                    onClick={() => changePage(index)}
                                    key={index}
                                >
                                    {index + 1}
                                </li>
                            ))}
                            <li
                                className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                                    currentPage == totalPage - 1
                                        ? 'bg-[#cccccc] pointer-events-none'
                                        : ' cursor-pointer'
                                }`}
                                onClick={nextPage}
                            >
                                <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoansList
