"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface AnimatedGradientProps {
  className?: string
  children?: React.ReactNode
  containerClassName?: string
  colors?: string[]
  duration?: number
  blur?: number
}

export function AnimatedGradient({
  className,
  children,
  containerClassName,
  colors = ["#5ddcff", "#3c67e3", "#4e00c2"],
  duration = 10,
  blur = 100,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let hue = 0

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const circles = colors.map((color, i) => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 100 + i * 20,
      color,
      velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update circle positions
      circles.forEach((circle) => {
        circle.x += circle.velocity.x
        circle.y += circle.velocity.y

        // Bounce off walls
        if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) {
          circle.velocity.x *= -1
        }
        if (circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) {
          circle.velocity.y *= -1
        }

        // Draw gradient circle
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.radius)
        gradient.addColorStop(0, circle.color)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Apply blur filter
      ctx.filter = `blur(${blur}px)`

      hue += 0.1
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colors, blur])

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <canvas ref={canvasRef} className={cn("absolute inset-0 w-full h-full -z-10", className)} />
      {children}
    </div>
  )
}
