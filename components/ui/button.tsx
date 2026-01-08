import * as React from "react"
import { Slot as SlotPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary red gradient button
        default: "bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/20 hover:shadow-red-500/40",
        // Premium dark button with red border
        premium: "bg-gradient-to-r from-neutral-900 to-black text-white border border-red-500/30 hover:border-red-400/50 shadow-xl hover:shadow-red-500/10",
        // Glass outline button
        outline: "border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 text-foreground",
        // Secondary muted button
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost transparent button
        ghost: "hover:bg-white/10 hover:text-foreground",
        // Destructive red gradient
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/20",
        // Silver gradient button
        silver: "bg-gradient-to-r from-slate-400 to-slate-500 text-slate-900 hover:from-slate-300 hover:to-slate-400 shadow-lg shadow-slate-400/20",
        // Link style
        link: "text-red-500 underline-offset-4 hover:underline hover:text-red-400",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? SlotPrimitive.Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
