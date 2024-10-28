// src/api/toolService.ts
export interface Tool {
  id: number;
  name: string;
  available: boolean;
}

export async function fetchTools(): Promise<Tool[]> {
  try {
    const response = await fetch("http://localhost:8000/api/tools"); // Cambia la URL si es necesario
    if (!response.ok) {
      throw new Error("Error al obtener las herramientas");
    }
    console.log("Marlon resp", response.json())
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
