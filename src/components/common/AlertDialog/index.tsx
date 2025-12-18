import { Loader2 } from 'lucide-react'
import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { AlertDialogProps } from './types'

const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  isLoading = false,
  disabled = false,
}: AlertDialogProps) => {
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isLoading && !disabled) {
      await onConfirm()
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-primary-foreground'
      case 'default':
      default:
        return 'bg-foreground hover:bg-foreground/90 text-background'
    }
  }

  return (
    <AlertDialogPrimitive open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled || isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={getVariantClasses()}
            disabled={disabled || isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  )
}

export default AlertDialog

