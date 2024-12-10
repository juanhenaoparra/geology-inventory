'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { fetchStockItems, StockItem } from '@/services/StocksServices'
import { fetchUsers } from '@/services/UsersServices'
import { submitLoan } from '@/services/LoansServices'
import { User } from '@/models/business/user.model'
import { useToast } from '@/hooks/use-toast'

interface FormData {
    userId: string
    stockId: string
    loanDate: string
    returnDate: string
    observation: string
}

const LoanCreationPage = () => {
    const [formData, setFormData] = useState<FormData>({
        userId: '',
        stockId: '',
        loanDate: '',
        returnDate: '',
        observation: '',
    })
    const [users, setUsers] = useState<User[]>([])
    const [stocks, setStocks] = useState<StockItem[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { toast } = useToast()

    useEffect(() => {
        async function fetchData() {
            try {
                const usersData = await fetchUsers()
                const stocksData = await fetchStockItems()
                setUsers(usersData)
                setStocks(stocksData)
            } catch (error) {
                console.error('Error al cargar datos:', error)
            }
        }
        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.userId) newErrors.userId = 'El usuario es obligatorio'
        if (!formData.stockId) newErrors.stockId = 'El stock es obligatorio'
        if (!formData.loanDate) newErrors.loanDate = 'La fecha de préstamo es obligatoria'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                await submitLoan(formData)
                toast({
                    title: '¡Éxito!',
                    description: 'Préstamo registrado con éxito.',
                    duration: 3000,
                })
                setFormData({
                    userId: '',
                    stockId: '',
                    loanDate: '',
                    returnDate: '',
                    observation: '',
                })
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'No se pudo registrar el préstamo. Intenta nuevamente.',
                    variant: 'destructive',
                    duration: 3000,
                })
            }
        } else {
            toast({
                title: 'Error',
                description: 'Por favor completa los campos obligatorios.',
                variant: 'destructive',
                duration: 3000,
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-lg"
            >
                <h2 className="text-2xl font-bold mb-4">Registrar Préstamo</h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="userId">Usuario</Label>
                        <Select
                            onValueChange={(value) => handleSelectChange('userId', value)}
                            value={formData.userId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar usuario" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.userId && <p className="text-red-500 text-sm">{errors.userId}</p>}
                    </div>

                    <div>
                        <Label htmlFor="stockId">Stock</Label>
                        <Select
                            onValueChange={(value) => handleSelectChange('stockId', value)}
                            value={formData.stockId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar item de stock" />
                            </SelectTrigger>
                            <SelectContent>
                                {stocks.map((stock) => (
                                    <SelectItem key={stock.id} value={stock.id.toString()}>
                                        {stock.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.stockId && <p className="text-red-500 text-sm">{errors.stockId}</p>}
                    </div>

                    <div>
                        <Label htmlFor="loanDate">Fecha de Préstamo</Label>
                        <Input
                            id="loanDate"
                            name="loanDate"
                            type="date"
                            value={formData.loanDate}
                            onChange={handleChange}
                        />
                        {errors.loanDate && (
                            <p className="text-red-500 text-sm">{errors.loanDate}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="returnDate">Fecha de Devolución</Label>
                        <Input
                            id="returnDate"
                            name="returnDate"
                            type="date"
                            value={formData.returnDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="observation">Observaciones (Opcional)</Label>
                        <Textarea
                            id="observation"
                            name="observation"
                            value={formData.observation}
                            onChange={handleChange}
                            placeholder="Añade observaciones (opcional)"
                        />
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        Registrar Préstamo
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default LoanCreationPage