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
import { submitLoan } from '@/services/LoansServices'
import { useToast } from '@/hooks/use-toast'
import { useUserStore } from '@/globalStates/useUserStore'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

interface FormData {
    stockId: string
    loanDate: string
    returnDate: string
    observation: string
}

interface GroupMember {
    id: string
    name: string
    student_code: string
}

const CreateLoanPage = () => {
    const { user } = useUserStore()
    const [formData, setFormData] = useState<FormData>({
        stockId: '',
        loanDate: '',
        returnDate: '',
        observation: '',
    })
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
    const [stocks, setStocks] = useState<StockItem[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { toast } = useToast()
    const navigate = useNavigate()

    async function fetchData() {
        try {
            const stocksData = await fetchStockItems()
            setStocks(stocksData)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error al cargar los datos de stock.',
                variant: 'destructive',
            })
        }
    }

    useEffect(() => {
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

    const handleAddGroupMember = () => {
        setGroupMembers([...groupMembers, { id: uuidv4(), name: '', student_code: '' }])
    }

    const handleGroupMemberChange = (id: string, field: keyof GroupMember, value: string) => {
        const updatedMembers = groupMembers.map((member) =>
            member.id === id ? { ...member, [field]: value } : member,
        )
        setGroupMembers(updatedMembers)
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.stockId) newErrors.stockId = 'El stock es obligatorio'
        if (!formData.loanDate) newErrors.loanDate = 'La fecha de préstamo es obligatoria'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                const payload = {
                    ...formData,
                    userId: user.id.toString(),
                    external_users: groupMembers.map(({ id, ...rest }) => rest),
                }
                const response = await submitLoan(payload)

                if (response.ok) {
                    toast({
                        title: '¡Éxito!',
                        description: 'Préstamo registrado con éxito.',
                    })
                    navigate('/loans') // Redirigir a la página de préstamos
                } else {
                    toast({
                        title: 'Error',
                        description: `Error al registrar el préstamo: ${
                            response.statusText || 'Algo salió mal.'
                        }`,
                        variant: 'destructive',
                    })
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Hubo un problema al registrar el préstamo.',
                    variant: 'destructive',
                })
            }
        } else {
            toast({
                title: 'Error',
                description: 'Por favor completa los campos obligatorios.',
                variant: 'destructive',
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

                    <div>
                        <Label>Miembros del Grupo</Label>
                        {groupMembers.map((member) => (
                            <div key={member.id} className="flex space-x-2 mb-2">
                                <Input
                                    placeholder="Nombre"
                                    value={member.name}
                                    onChange={(e) =>
                                        handleGroupMemberChange(member.id, 'name', e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Código de estudiante"
                                    value={member.student_code}
                                    onChange={(e) =>
                                        handleGroupMemberChange(
                                            member.id,
                                            'student_code',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        ))}
                        <Button type="button" onClick={handleAddGroupMember}>
                            Agregar Miembro
                        </Button>
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        Registrar Préstamo
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateLoanPage
