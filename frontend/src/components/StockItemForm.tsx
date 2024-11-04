'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitStockItem } from '@/services/api'

export default function StockItemForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    inventoryCode: '',
    quantity: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.inventoryCode.trim()) newErrors.inventoryCode = 'Inventory code is required'
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required'
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await submitStockItem(formData);
        setFormData({ name: '', description: '', inventoryCode: '', quantity: '' });
        setNotification({ message: 'Stock item added successfully!', type: 'success' });
      } catch (error) {
        console.error('Error submitting form:', error);
        setNotification({ message: 'Error submitting form. Please try again.', type: 'error' });
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {notification && (
        <div className={`p-4 mb-4 text-sm ${notification.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-lg`} role="alert">
          {notification.message}
        </div>
      )}
      <CardHeader>
        <CardTitle>Add Stock Item</CardTitle>
        <CardDescription>Enter the details of the new stock item.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventoryCode">Inventory Code</Label>
            <Input
              id="inventoryCode"
              name="inventoryCode"
              value={formData.inventoryCode}
              onChange={handleChange}
              placeholder="Enter inventory code"
            />
            {errors.inventoryCode && <p className="text-sm text-red-500">{errors.inventoryCode}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="1"
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Add Stock Item</Button>
        </CardFooter>
      </form>
    </Card>
  )
}