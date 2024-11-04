'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

import { submitStockItem } from '@/services/api'

type Quality = 'malo' | 'bueno' | 'nuevo'

interface FormData {
  name: string
  description: string
  inventory_code: string
  quality: Quality | ''
}

export default function StockItemForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    inventory_code: '',
    quality: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleQualityChange = (value: Quality) => {
    setFormData(prev => ({ ...prev, quality: value }))
    if (errors.quality) {
      setErrors(prev => ({ ...prev, quality: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.inventory_code.trim()) newErrors.inventory_code = 'Inventory code is required'
    if (!formData.quality) newErrors.quality = 'Quality is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await submitStockItem(formData)

        toast({
          title: "Success",
          description: "Stock item added successfully!",
          duration: 3000,
        })

        setFormData({ name: '', description: '', inventory_code: '', quality: '' })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add stock item. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
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
              <Label htmlFor="inventory_code">Inventory Code</Label>
              <Input
                id="inventory_code"
                name="inventory_code"
                value={formData.inventory_code}
                onChange={handleChange}
                placeholder="Enter inventory code"
              />
              {errors.inventory_code && <p className="text-sm text-red-500">{errors.inventory_code}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select onValueChange={handleQualityChange} value={formData.quality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malo">Malo</SelectItem>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                </SelectContent>
              </Select>
              {errors.quality && <p className="text-sm text-red-500">{errors.quality}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Add Stock Item</Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </>
  )
}