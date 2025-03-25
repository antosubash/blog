import React from 'react'
import { designSystemUtils } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success'
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', label, error, helperText, ...props }, ref) => {
    const inputClasses = designSystemUtils.input(variant)

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label}
          </label>
        )}
        <input className={cn(inputClasses, className)} ref={ref} {...props} />
        {error && <p className="text-sm text-error-600 dark:text-error-400">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
