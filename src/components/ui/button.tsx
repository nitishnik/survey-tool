import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        data-slot="button"
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:shadow-md aria-invalid:shadow-destructive/50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-[hsl(27_87%_54%)]': variant === 'secondary',
            'bg-background shadow-sm hover:bg-muted hover:text-foreground hover:shadow-md':
              variant === 'outline',
            'hover:bg-muted hover:text-foreground': variant === 'ghost',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40':
              variant === 'destructive',
            'h-9 px-4 py-2 has-[>svg]:px-3': size === 'default',
            'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5': size === 'sm',
            'h-10 rounded-md px-6 has-[>svg]:px-4': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
