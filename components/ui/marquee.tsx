import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface MarqueeProps {
  className?: string
  pauseOnHover?: boolean
  direction?: "left" | "right"
  children: ReactNode
}

export function Marquee({ className, pauseOnHover = false, direction = "left", children }: MarqueeProps) {
  return (
    <div
      className={cn(
        "flex w-full overflow-hidden [--duration:40s] [--gap:1rem]",
        pauseOnHover && "hover:[animation-play-state:paused]",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap] animate-marquee",
          direction === "right" && "animate-marquee-reverse",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap] animate-marquee",
          direction === "right" && "animate-marquee-reverse",
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
}
