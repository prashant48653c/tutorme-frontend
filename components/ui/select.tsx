"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

const SelectGroup = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>
>(function SelectGroup({ ...props }, ref) {
  return <SelectPrimitive.Group ref={ref} data-slot="select-group" {...props} />
})

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(function SelectValue({ ...props }, ref) {
  return <SelectPrimitive.Value ref={ref} data-slot="select-value" {...props} />
})

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default"
    fullWidth?: boolean
  }
>(function SelectTrigger(
  { className, size = "default", fullWidth = false, children, ...props },
  ref
) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "group border-input bg-background text-foreground data-[placeholder]:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 flex w-full sm:w-max items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm shadow-xs outline-none transition-all duration-200 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-accent/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 data-[size=default]:h-9 sm:data-[size=default]:h-10 data-[size=sm]:h-8 sm:data-[size=sm]:h-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-5",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 sm:size-5 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    mobileFullScreen?: boolean
  }
>(function SelectContent(
  { className, children, position = "popper", mobileFullScreen = true, sideOffset = 6, ...props },
  ref
) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    if (!mobileFullScreen) {
      setIsMobile(false)
      return
    }
    if (typeof window === "undefined" || !window.matchMedia) return
    const query = window.matchMedia("(max-width: 640px)")
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)

    setIsMobile(query.matches)
    if (query.addEventListener) {
      query.addEventListener("change", handleChange)
    } else {
      // Fallback for safari
      query.addListener(handleChange)
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handleChange)
      } else {
        query.removeListener(handleChange)
      }
    }
  }, [mobileFullScreen])

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[min(var(--radix-select-content-available-height),400px)] sm:max-h-[min(var(--radix-select-content-available-height),500px)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-hidden rounded-md border shadow-lg sm:shadow-xl backdrop-blur-sm",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          mobileFullScreen &&
            "sm:relative sm:max-w-xs",
          isMobile &&
            "fixed inset-x-3 bottom-6 top-auto mx-auto h-auto max-h-[65vh] w-auto rounded-2xl border-border/70 bg-background/95 shadow-2xl backdrop-blur-lg",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1 scroll-smooth"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      data-slot="select-label"
      className={cn("text-muted-foreground px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm", className)}
      {...props}
    />
  )
})

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none ring-offset-background transition-all duration-150 sm:px-4 sm:py-2.5 sm:text-base focus-visible:ring-2 focus-visible:ring-ring/50 focus:bg-accent/60 focus:text-accent-foreground data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:font-semibold data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent/50 active:scale-[0.99]",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText asChild>
        <span className="flex flex-1 items-center gap-2 text-left">{children}</span>
      </SelectPrimitive.ItemText>
      <span className="absolute right-3 flex size-4 items-center justify-center text-primary sm:right-4">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 sm:size-5" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
})

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1.5 h-px sm:-mx-1.5", className)}
      {...props}
    />
  )
})

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(function SelectScrollUpButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      data-slot="select-scroll-up-button"
      className={cn(
        "sticky top-0 flex cursor-default items-center justify-center bg-gradient-to-b from-background/90 to-transparent py-1 text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4 sm:size-5" />
    </SelectPrimitive.ScrollUpButton>
  )
})

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(function SelectScrollDownButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      data-slot="select-scroll-down-button"
      className={cn(
        "sticky bottom-0 flex cursor-default items-center justify-center bg-gradient-to-t from-background/90 to-transparent py-1 text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4 sm:size-5" />
    </SelectPrimitive.ScrollDownButton>
  )
})

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
