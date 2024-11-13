import React from 'react'

interface PaginationState {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

interface PaginationProps {
    pagination: PaginationState
    onPaginationChange: (newPage: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPaginationChange }) => {
    const { currentPage, pageSize, totalItems, totalPages, hasNext, hasPrev } = pagination

    const handleNextPage = () => {
        if (hasNext) {
            onPaginationChange(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (hasPrev) {
            onPaginationChange(currentPage - 1)
        }
    }

    return (
        <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
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
                                onClick={handlePrevPage}
                                disabled={!hasPrev}
                            >
                                <img
                                    src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg"
                                    alt="Página anterior"
                                />
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => onPaginationChange(index + 1)}
                                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                                        currentPage === index + 1
                                            ? 'text-blue-600 border-sky-500'
                                            : 'border-[#E4E4EB]'
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
                                onClick={handleNextPage}
                                disabled={!hasNext}
                            >
                                <img
                                    src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg"
                                    alt="Siguiente página"
                                />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Pagination
