import { useEffect, useState } from 'react'
import { fetchStockItemById, updateStockItem, StockItem } from '../../services/StocksServices'
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

interface EditStockItemProps {
    itemId: number
}

export default function EditStockItemForm({ itemId }: EditStockItemProps) {
    const [formData, setFormData] = useState<StockItem | null>(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        async function fetchData() {
            const item = await fetchStockItemById(itemId)
            setFormData(item)
            setLoading(false)
        }
        fetchData()
    }, [itemId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
    }

    const handleQualityChange = (value: string) => {
        setFormData((prev) => (prev ? { ...prev, quality: value } : null))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData) {
            const updatedItem = await updateStockItem(itemId, formData)
            if (updatedItem) {
                toast({
                    title: 'Success',
                    description: 'Ítem de stock actualizado correctamente',
                    duration: 3000,
                })
                setFormData(updatedItem)
            } else {
                toast({
                    title: 'Error',
                    description: 'Error al actualizar el ítem de stock',
                    variant: 'destructive',
                    duration: 3000,
                })
            }
        }
    }

    if (loading) return <p>Cargando...</p>

    return (
        <>
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Edit Stock Item</CardTitle>
                    <CardDescription>Edit the details of the stock item.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData?.name || ''}
                                onChange={handleChange}
                                placeholder="Enter item name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData?.description || ''}
                                onChange={handleChange}
                                placeholder="Enter item description"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="inventory_code">Inventory Code</Label>
                            <Input
                                id="inventory_code"
                                name="inventory_code"
                                value={formData?.inventory_code || ''}
                                onChange={handleChange}
                                placeholder="Enter inventory code"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quality">Quality</Label>
                            <Select
                                onValueChange={handleQualityChange}
                                value={formData?.quality || ''}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="malo">Malo</SelectItem>
                                    <SelectItem value="bueno">Bueno</SelectItem>
                                    <SelectItem value="nuevo">Nuevo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Update Stock Item
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Toaster />
        </>
    )
}
