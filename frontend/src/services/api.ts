const API_HOST = import.meta.env.VITE_API_HOST;
import { LoanHistory } from "@models/business/loan.model";

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

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export const getLoans = async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<LoanHistory>> => {
    const response = await fetch(`${API_HOST}/loans?page=${page}&page_size=${pageSize}`);
    return await response.json();
};

