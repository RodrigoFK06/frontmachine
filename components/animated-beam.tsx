"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface AnimatedBeamProps {
  className?: string
  children?: React.ReactNode
  numBeams?: number
  beamColor?: string
  beamOpacity?: number
  beamWidth?: number
  beamDuration?: number
}

export function AnimatedBeam({
  className,
  children,
  numBeams = 5,
  beamColor = "currentColor",
  beamOpacity = 0.3,
  beamWidth = 2,
  beamDuration = 2,
}: AnimatedBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [beams, setBeams] = useState<{ x: number; y: number; angle: number; delay: number }[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const generateBeams = () => {
      const newBeams = []
      for (let i = 0; i < numBeams; i++) {
        newBeams.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          angle: Math.random() * 360,
          delay: Math.random() * beamDuration,
        })
      }
      setBeams(newBeams)
    }

    generateBeams()
    const interval = setInterval(generateBeams, beamDuration * 1000)

    return () => clearInterval(interval)
  }, [numBeams, beamDuration])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {children}
      {beams.map((beam, i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `rotate(${beam.angle}deg)`,
            opacity: beamOpacity,
            animation: `beam ${beamDuration}s ease-in-out infinite`,
            animationDelay: `${beam.delay}s`,
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${beam.x}%`,
              top: `${beam.y}%`,
              width: `${beamWidth}px`,
              height: "200%",
              background: `linear-gradient(to bottom, transparent, ${beamColor}, transparent)`,
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes beam {
          0% {
            opacity: 0;
            transform: rotate(${beams[0]?.angle}deg) translateY(100%);
          }
          20% {
            opacity: ${beamOpacity};
          }
          80% {
            opacity: ${beamOpacity};
          }
          100% {
            opacity: 0;
            transform: rotate(${beams[0]?.angle}deg) translateY(-100%);
          }
        }
      `}</style>
    </div>
  )
}
