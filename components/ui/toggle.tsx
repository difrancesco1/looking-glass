import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: [string, string]
  value: string
  onChange: (value: string) => void
  className?: string
}

function Toggle({ options, value, onChange, className, ...props }: ToggleProps) {
  const [option1, option2] = options

  return (
    <div
      className={cn(
        "relative flex h-10 w-fit rounded-full border border-[var(--input-border)] bg-[var(--input-background)] p-1",
        className
      )}
      {...props}
    >
      <div
        className="absolute w-[calc(50%-4px)] h-[calc(80%)] rounded-3xl bg-white opacity-80 transition-transform duration-200"
        style={{
          transform: `translateX(${value === option2 ? "calc(100% + 1px)" : "0px"})`
        }}
      />
      {[option1, option2].map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "relative z-10 px-4 py-1 text-sm transition-colors",
            value === option
              ? "text-[var(--input-background)]"
              : "text-[var(--input-text)]"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export { Toggle }
