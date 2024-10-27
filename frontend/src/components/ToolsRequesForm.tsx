import React, { useState } from 'react';

const ToolRequestForm: React.FC = () => {
    const [toolName, setToolName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar la solicitud
        console.log(`Solicitando herramienta: ${toolName}`);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <input
                type="text"
                placeholder="Nombre de la herramienta"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                required
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 mt-2 rounded"
            >
                Solicitar Herramienta
            </button>
        </form>
    );
};

export default ToolRequestForm;
export { }