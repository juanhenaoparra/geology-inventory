import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStockItems, StockItem } from '../../services/api';

const StockList: React.FC = () => {
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStockItems() {
            try {
                const items = await fetchStockItems();
                console.log("Marlon items", items)
                setStockItems(items);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch stock items');
                setLoading(false);
            }
        }
        loadStockItems();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                                <Link to={`/edit-stock/${item.id}`} className="text-blue-500 hover:underline">EDIT</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
