"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface FloatingIcon {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  icon: React.ReactNode
  velocity: {
    x: number
    y: number
    rotation: number
  }
}

interface FloatingIconsProps {
  className?: string
  icons: React.ReactNode[]
  count?: number
  minSize?: number
  maxSize?: number
  speed?: number
}

export function FloatingIcons({
  className,
  icons,
  count = 10,
  minSize = 20,
  maxSize = 40,
  speed = 1,
}: FloatingIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current || icons.length === 0) return

    const { width, height } = containerRef.current.getBoundingClientRect()

    // Initialize floating icons
    const initialIcons: FloatingIcon[] = Array.from({ length: count }).map((_, i) => {
      const size = minSize + Math.random() * (maxSize - minSize)
      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        rotation: Math.random() * 360,
        icon: icons[Math.floor(Math.random() * icons.length)],
        velocity: {
          x: (Math.random() - 0.5) * speed,
          y: (Math.random() - 0.5) * speed,
          rotation: (Math.random() - 0.5) * 2,
        },
      }
    })

    setFloatingIcons(initialIcons)

    // Animation loop
    const animate = () => {
      setFloatingIcons((prevIcons) => {
        return prevIcons.map((icon) => {
          let { x, y, rotation } = icon
          const { velocity } = icon

          // Update position
          x += velocity.x
          y += velocity.y
          rotation += velocity.rotation

          // Bounce off walls
          if (x < 0 || x > width) {
            velocity.x *= -1
            x = Math.max(0, Math.min(x, width))
          }

          if (y < 0 || y > height) {
            velocity.y *= -1
            y = Math.max(0, Math.min(y, height))
          }

          return { ...icon, x, y, rotation }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [icons, count, minSize, maxSize, speed])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {floatingIcons.map((icon) => (
        <div
          key={icon.id}
          className="absolute pointer-events-none opacity-30"
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            width: `${icon.size}px`,
            height: `${icon.size}px`,
            transform: `rotate(${icon.rotation}deg)`,
            transition: "transform 0.5s ease-out",
          }}
        >
          {icon.icon}
        </div>
      ))}
    </div>
  )
}
