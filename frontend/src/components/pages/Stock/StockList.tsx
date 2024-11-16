import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStockItems, StockItem, deleteStockItem } from '@/services/StocksServices'

const StockList: React.FC = () => {
    const [stockItems, setStockItems] = useState<StockItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null)

    useEffect(() => {
        async function loadStockItems() {
            try {
                const items = await fetchStockItems()
                setStockItems(items)
                setLoading(false)
            } catch (error) {
                setError('Failed to fetch stock items')
                setLoading(false)
            }
        }
        loadStockItems()
    }, [])

    const handleDelete = async (item: StockItem) => {
        setItemToDelete(item)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!itemToDelete) return

        try {
            await deleteStockItem(itemToDelete.id)
            setStockItems(stockItems.filter((item) => item.id !== itemToDelete.id))
            setShowDeleteModal(false)
            setItemToDelete(null)
        } catch (error) {
            setError('Failed to delete item')
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Stock List</h2>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Inventory Code</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Quality</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stockItems.map((item) => (
                        <tr key={item.id}>
                            <td className="border px-4 py-2">{item.id}</td>
                            <td className="border px-4 py-2">{item.inventory_code}</td>
                            <td className="border px-4 py-2">{item.name}</td>
                            <td className="border px-4 py-2">{item.quality}</td>
                            <td className="border px-4 py-2">{item.description}</td>
                            <td className="border px-4 py-2">
                                <Link
                                    to={`/edit-stock/${item.id}`}
                                    className="text-blue-500 hover:underline mr-4"
                                >
                                    EDIT
                                </Link>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="text-red-500 hover:underline"
                                >
                                    DELETE
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete {itemToDelete?.name}?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StockList
