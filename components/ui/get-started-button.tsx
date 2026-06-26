import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import * as React from "react"

export interface GetStartedButtonProps {
  text?: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => void)
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  style?: React.CSSProperties
}

export function GetStartedButton({
  text = "Get Started",
  className = "",
  ...props
}: GetStartedButtonProps) {
  return (
    <Button
      className={`group relative overflow-hidden w-full sm:w-auto font-sans text-xs font-bold uppercase tracking-wider h-14 px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xl hover:scale-105 bg-white hover:bg-neutral-100 text-black ${className}`}
      {...props}
    >
      <span className="mr-6 transition-opacity duration-500 group-hover:opacity-0">
        {text}
      </span>
      <i className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full z-10 grid w-10 place-items-center transition-all duration-500 bg-black/10 group-hover:w-[calc(100%-0.75rem)] group-active:scale-95 text-black">
        <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
      </i>
    </Button>
  )
}
