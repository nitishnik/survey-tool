import type { ReactNode } from 'react'

export type AlertDialogVariant = 'default' | 'destructive' | 'primary'

export interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string | ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  variant?: AlertDialogVariant
  isLoading?: boolean
  disabled?: boolean
}

