import * as React from "react"

import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-none border-none bg-input px-2 py-1 text-lg text-text-white text-shadow-minecraft",
        "shadow-[inset_2px_2px_0_theme('colors.gray'),inset_-2px_-2px_0_theme('colors.white')]",
        "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-white/70 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:bg-input-hover",
        "font-minecraft",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

