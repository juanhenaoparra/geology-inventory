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

export const getLoans = async () => {
  const response = await fetch(`${API_HOST}/loans`);
  return await response.json();
};

