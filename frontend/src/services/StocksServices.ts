import { STOCKS_API_HOST } from './api'

export interface StockItem {
    id: number
    name: string
    description: string
    inventory_code: string
    quality: string
}

// Función para agregar un nuevo ítem de stock
export const submitStockItem = async (formData: {
    name: string
    description: string
    inventory_code: string
    quality: string
}) => {
    const response = await fetch(`${STOCKS_API_HOST}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    return await response.json()
}

// Función para obtener todos los ítems de stock
export async function fetchStockItems(): Promise<StockItem[]> {
    try {
        const response = await fetch(`${STOCKS_API_HOST}`)
        if (!response.ok) {
            throw new Error('Error al obtener los ítems de stock')
        }
        return response.json()
    } catch (error) {
        console.error('Error obteniendo ítems:', error)
        return []
    }
}

// Función para obtener un ítem de stock por su ID
export async function fetchStockItemById(id: number): Promise<StockItem | null> {
    try {
        const response = await fetch(`${STOCKS_API_HOST}/${id}`)
        if (!response.ok) {
            throw new Error('Error al obtener el ítem de stock')
        }
        return response.json()
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

// Función para actualizar un ítem de stock
export async function updateStockItem(
    id: number,
    updatedData: Partial<StockItem>,
): Promise<StockItem | null> {
    try {
        const response = await fetch(`${STOCKS_API_HOST}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        if (!response.ok) {
            throw new Error('Error al actualizar el ítem de stock')
        }
        return response.json()
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

// Función para eliminar un ítem de stock
export const deleteStockItem = async (id: number): Promise<void> => {
    const response = await fetch(`${STOCKS_API_HOST}/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to delete stock item')
    }
}
