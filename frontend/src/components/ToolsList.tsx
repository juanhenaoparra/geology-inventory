import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Tool {
    id: number; // O el tipo que corresponda en tu API
    name: string; // Ajusta esto según la estructura de tu API
}

const ToolList: React.FC = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchTools = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tools');
            setTools(response.data); // Ajusta esto según la respuesta de tu API
        } catch (error) {
            setError('Error al obtener las herramientas');
        }
    };

    useEffect(() => {
        fetchTools();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold">Herramientas Disponibles</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="list-disc pl-5">
                {tools.map((tool) => (
                    <li key={tool.id}>{tool.name}</li> // Asegúrate de que estas propiedades existan en tu respuesta
                ))}
            </ul>
        </div>
    );
};

export default ToolList;
