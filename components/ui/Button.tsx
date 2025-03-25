import React from 'react'
import { designSystemUtils } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'button'
    const buttonClasses = designSystemUtils.button(variant, size)

    return <Comp className={cn(buttonClasses, className)} ref={ref} {...props} />
  }
)

Button.displayName = 'Button'

export default Button
