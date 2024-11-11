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
import { submitLoan, fetchUsers, fetchTools, User, Tool } from '@/services/ToolsServices'

interface FormData {
    userId: string
    toolId: string
    loanDate: string
    returnDate: string
    status: string
    observation: string
}

export default function LoanReturnForm() {
    const [formData, setFormData] = useState<FormData>({
        userId: '',
        toolId: '',
        loanDate: '',
        returnDate: '',
        status: '',
        observation: '',
    })
    const [users, setUsers] = useState<User[]>([]) // Tipo explícito User[]
    const [tools, setTools] = useState<Tool[]>([]) // Tipo explícito Tool[]
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { toast } = useToast()

    useEffect(() => {
        // Fetch users and tools data from the backend
        async function fetchData() {
            const usersData = await fetchUsers()
            const toolsData = await fetchTools()
            setUsers(usersData)
            setTools(toolsData)
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
        if (!formData.toolId) newErrors.toolId = 'Tool is required'
        if (!formData.loanDate) newErrors.loanDate = 'Loan date is required'
        if (!formData.status) newErrors.status = 'Status is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                await submitLoan(formData)
                toast({
                    title: 'Success',
                    description: 'Loan registered successfully!',
                    duration: 3000,
                })
                // Clear form after submission
                setFormData({
                    userId: '',
                    toolId: '',
                    loanDate: '',
                    returnDate: '',
                    status: '',
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
                    <CardTitle>Register Loan/Return</CardTitle>
                    <CardDescription>
                        Fill out the form to register a loan or return.
                    </CardDescription>
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
                            <Label htmlFor="toolId">Tool</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('toolId', value)}
                                value={formData.toolId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tool" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tools.map((tool: Tool) => (
                                        <SelectItem key={tool.id} value={tool.id.toString()}>
                                            {tool.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.toolId && (
                                <p className="text-sm text-red-500">{errors.toolId}</p>
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
                            <Label htmlFor="status">Status</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('status', value)}
                                value={formData.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="returned">Returned</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-500">{errors.status}</p>
                            )}
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
                            Register Loan/Return
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Toaster />
        </>
    )
}
