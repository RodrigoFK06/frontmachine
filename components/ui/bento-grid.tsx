import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"

interface BentoGridProps {
  className?: string
  children: ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>{children}</div>
}

interface BentoCardProps {
  className?: string
  Icon?: any
  name: string
  description: string
  href?: string
  cta?: string
  background?: ReactNode
}

export function BentoCard({ className, Icon, name, description, href, cta, background }: BentoCardProps) {
  return (
    <div
      className={cn("row-span-1 rounded-xl group/bento relative overflow-hidden border bg-background p-6", className)}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {href && cta && (
          <Link href={href} className="mt-4 inline-flex items-center text-sm font-medium text-primary">
            {cta}
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">{background}</div>
    </div>
  )
}
