import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "accent"
  children: React.ReactNode
}

const badgeVariants = {
  primary: "bg-accent-muted/50 text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-accent-muted/50 text-foreground",
  warning: "bg-accent-muted/50 text-foreground",
  error: "bg-destructive/20 text-destructive",
  accent: "bg-accent text-primary-foreground",
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
          badgeVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export default Badge
