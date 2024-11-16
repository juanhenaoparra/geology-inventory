import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Cross1Icon } from '@radix-ui/react-icons'

const dialogOverlayVariants = cva('fixed inset-0 bg-black/50 backdrop-blur-sm z-50')
const dialogContentVariants = cva(
    'fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md max-w-lg z-50',
    {
        variants: {
            size: {
                sm: 'max-w-sm',
                md: 'max-w-md',
                lg: 'max-w-lg',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
)

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(dialogOverlayVariants, className)}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
        VariantProps<typeof dialogContentVariants>
>(({ className, size, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(dialogContentVariants({ size }), className)}
            {...props}
        >
            <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <Cross1Icon className="w-5 h-5" />
            </DialogClose>
            {children}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn('text-lg font-bold text-gray-900', className)}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-gray-600 mt-2', className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogClose = DialogPrimitive.Close

export {
    Dialog,
    DialogTrigger,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
}
