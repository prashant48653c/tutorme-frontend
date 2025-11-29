"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-md border-2 border-gray-200 bg-white text-primaryBlack transition-colors duration-150",
        "hover:border-[#09C4AE]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#09C4AE]",
        "data-[state=checked]:bg-[#09C4AE] data-[state=checked]:border-[#09C4AE] data-[state=checked]:text-white",
        "data-[state=indeterminate]:bg-[#09C4AE] data-[state=indeterminate]:border-[#09C4AE]",
        "aria-invalid:border-destructive/80 aria-invalid:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
