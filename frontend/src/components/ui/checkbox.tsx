"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="peer h-4 w-4 shrink-0 opacity-0 absolute inset-0 cursor-pointer z-10"
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    ref={ref}
                    {...props}
                />
                <div className={cn(
                    "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
                    "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    checked ? "bg-primary text-primary-foreground" : "bg-white dark:bg-zinc-950",
                    className
                )}>
                    {checked && <Check className="h-3 w-3 m-[1px]" />}
                </div>
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
