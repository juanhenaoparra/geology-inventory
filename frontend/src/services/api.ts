const API_HOST = import.meta.env.VITE_API_HOST;

export const submitStockItem = async (formData: {
  name: string;
  description: string;
  inventoryCode: string;
  quantity: string;
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