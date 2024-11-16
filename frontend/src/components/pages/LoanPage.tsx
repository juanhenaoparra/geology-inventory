// LoanPage.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { fetchStockItems, StockItem } from '@/services/StocksServices'
import { fetchUsers, User } from '@/services/UsersServices'
import { submitLoan } from '@/services/LoansServices'

interface FormData {
    userId: string
    stockId: string
    loanDate: string
    returnDate: string
    observation: string
}

export default function LoanPage() {
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
            const usersData = await fetchUsers()
            const stocksData = await fetchStockItems()
            setUsers(usersData)
            setStocks(stocksData)
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
        if (!formData.userId) newErrors.userId = 'User is required'
        if (!formData.stockId) newErrors.stockId = 'Stock is required'
        if (!formData.loanDate) newErrors.loanDate = 'Loan date is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                await submitLoan({ ...formData, status: 'active' })
                toast({
                    title: 'Success',
                    description: 'Loan registered successfully!',
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
                    description: 'Failed to register loan. Please try again.',
                    variant: 'destructive',
                    duration: 3000,
                })
            }
        } else {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields correctly.',
                variant: 'destructive',
                duration: 3000,
            })
        }
    }

    return (
        <>
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Register New Loan</CardTitle>
                    <CardDescription>Fill out the form to register a new loan.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userId">User</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('userId', value)}
                                value={formData.userId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user: User) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.userId && (
                                <p className="text-sm text-red-500">{errors.userId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stockId">Stock</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('stockId', value)}
                                value={formData.stockId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stock item" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stocks.map((stock: StockItem) => (
                                        <SelectItem key={stock.id} value={stock.id.toString()}>
                                            {stock.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.stockId && (
                                <p className="text-sm text-red-500">{errors.stockId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="loanDate">Loan Date</Label>
                            <Input
                                id="loanDate"
                                name="loanDate"
                                type="date"
                                value={formData.loanDate}
                                onChange={handleChange}
                            />
                            {errors.loanDate && (
                                <p className="text-sm text-red-500">{errors.loanDate}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="returnDate">Return Date</Label>
                            <Input
                                id="returnDate"
                                name="returnDate"
                                type="date"
                                value={formData.returnDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observation">Observation (Optional)</Label>
                            <Textarea
                                id="observation"
                                name="observation"
                                value={formData.observation}
                                onChange={handleChange}
                                placeholder="Enter any observations"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Register Loan
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Toaster />
        </>
    )
}
