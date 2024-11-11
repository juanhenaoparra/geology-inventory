const API_HOST = import.meta.env.VITE_API_HOST;

export const submitStockItem = async (formData: {
  name: string;
  description: string;
  inventory_code: string;
  quality: string;
}) => {
  const response = await fetch(`${API_HOST}/stock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

// src/api/stockService.ts
export interface StockItem {
  id: number;
  name: string;
  description: string;
  inventory_code: string;
  quality: string;
}

export async function fetchStockItems(): Promise<StockItem[]> {
  try {
    const response = await fetch(`${API_HOST}/stocks`); // Usa el host de la API desde las variables de entorno
    if (!response.ok) {
      throw new Error("Error al obtener los ítems de stock");
    }
    return response.json();
  } catch (error) {
    console.error("Error obteniendo ítems:", error);
    return [];
  }
}

export async function fetchStockItemById(id: number): Promise<StockItem | null> {
  try {
    const response = await fetch(`${API_HOST}/stocks/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el ítem de stock");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function updateStockItem(id: number, updatedData: Partial<StockItem>): Promise<StockItem | null> {
  try {
    const response = await fetch(`${API_HOST}/stocks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el ítem de stock");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
