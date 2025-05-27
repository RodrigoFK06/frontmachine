"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Label } from "@/store/use-store"
import { BookOpen, BarChart3 } from "lucide-react"
import Link from "next/link"

interface LabelCardProps {
  label: Label
  onSelect?: () => void
  isSelected?: boolean
}

export function LabelCard({ label, onSelect, isSelected = false }: LabelCardProps) {
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  // Función para generar un color de fondo basado en el nombre de la etiqueta
  // para simular diferentes imágenes de ejemplo
  const getBackgroundColor = (name: string) => {
    // Convertir el nombre a un número hash simple
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Generar un color HSL con tonalidad basada en el hash
    // pero con saturación y luminosidad fijas para mantener colores agradables
    const hue = hash % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  return (
    <Card className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{label.name}</CardTitle>
          <Badge className={difficultyColor[label.difficulty]}>
            {label.difficulty === "beginner"
              ? "Principiante"
              : label.difficulty === "intermediate"
                ? "Intermedio"
                : "Avanzado"}
          </Badge>
        </div>
        <CardDescription>{label.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="outline" className="mb-2">
          {label.category}
        </Badge>

        <div
          className="w-full aspect-video rounded-md flex items-center justify-center mt-2 overflow-hidden"
          style={{ backgroundColor: getBackgroundColor(label.name) }}
        >
          <div className="text-center p-4">
            <p className="font-medium text-gray-700">Ejemplo: {label.name}</p>
            <p className="text-sm text-gray-600 mt-1">Imagen ilustrativa</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {onSelect ? (
          <Button onClick={onSelect} variant={isSelected ? "default" : "outline"} className="w-full">
            {isSelected ? "Seleccionada" : "Seleccionar"}
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={`/labels/${label.id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Detalles
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={`/practice?label=${label.id}`}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Practicar
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
