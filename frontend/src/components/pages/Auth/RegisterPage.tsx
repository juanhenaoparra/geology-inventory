import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/globalStates/useUserStore'
import { updateUser } from '@/services/UsersServices'
import { useToast } from '@/hooks/use-toast'

const RegisterPage = () => {
    const { user, setUser } = useUserStore()
    const [formData, setFormData] = useState({
        id: user.id,
        name: user.name ?? '',
        email: user.email ?? '',
        semester: '',
        career: '',
        student_code: '',
        phone: '',
        role: user.role ?? 'student',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.student_code) newErrors.student_code = 'Código de estudiante es obligatorio'
        if (!formData.career) newErrors.career = 'Carrera es obligatoria'
        if (!formData.phone) newErrors.phone = 'Teléfono es obligatorio'
        if (formData.semester && isNaN(parseInt(formData.semester, 10))) {
            newErrors.semester = 'El semestre debe ser un número válido'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                const updatedUser = {
                    id: formData.id,
                    name: formData.name,
                    email: formData.email,
                    career: formData.career,
                    student_code: formData.student_code,
                    phone: formData.phone,
                    semester: formData.semester ?? '',
                    role: formData.role,
                }
                const result = await updateUser(updatedUser)
                setUser(result)
                toast({
                    title: '¡Éxito!',
                    description: 'Registro completado con éxito.',
                })
                window.location.href = '/home'
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Hubo un problema al registrar los datos.',
                    variant: 'destructive',
                })
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-lg"
            >
                <h2 className="text-2xl font-bold mb-4">Completa tu registro</h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" name="name" value={formData.name} disabled />
                    </div>
                    <div>
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" name="email" value={formData.email} disabled />
                    </div>
                    <div>
                        <Label htmlFor="student_code">Código de Estudiante</Label>
                        <Input
                            id="student_code"
                            name="student_code"
                            value={formData.student_code}
                            onChange={handleChange}
                        />
                        {errors.student_code && (
                            <p className="text-red-500 text-sm">{errors.student_code}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="career">Carrera</Label>
                        <Input
                            id="career"
                            name="career"
                            value={formData.career}
                            onChange={handleChange}
                        />
                        {errors.career && <p className="text-red-500 text-sm">{errors.career}</p>}
                    </div>
                    <div>
                        <Label htmlFor="semester">Semestre (Opcional)</Label>
                        <Input
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                        />
                        {errors.semester && (
                            <p className="text-red-500 text-sm">{errors.semester}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                    <Button type="submit" className="w-full mt-4">
                        Completar Registro
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterPage
