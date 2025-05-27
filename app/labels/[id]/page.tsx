"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLabels } from "@/hooks/use-labels"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import type { Label } from "@/store/use-store"

export default function LabelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { labels, isLoading } = useLabels()
  const [label, setLabel] = useState<Label | null>(null)

  // Asegurarnos de que labels sea un array
  const safeLabels = Array.isArray(labels) ? labels : []

  useEffect(() => {
    if (safeLabels.length > 0 && params.id) {
      const foundLabel = safeLabels.find((l) => l.id === params.id)
      if (foundLabel) {
        setLabel(foundLabel)
      } else {
        // Si no se encuentra la etiqueta, redirigir a la página de etiquetas
        router.push("/labels")
      }
    }
  }, [safeLabels, params.id, router])

  // Función para generar un color de fondo basado en el nombre de la etiqueta
  const getBackgroundColor = (name: string) => {
    if (!name) return "hsl(210, 70%, 85%)"

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = hash % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  const difficultyText = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  }

  const difficultyColor = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/labels">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-video" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!label) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/labels">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Etiqueta no encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/labels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{label.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-0">
            <div
              className="w-full aspect-video flex items-center justify-center"
              style={{ backgroundColor: getBackgroundColor(label.name) }}
            >
              <div className="text-center p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{label.name}</h2>
                <p className="text-gray-700">Imagen ilustrativa de la seña</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <p className="text-muted-foreground">{label.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{label.category}</Badge>
            <Badge className={difficultyColor[label.difficulty]}>{difficultyText[label.difficulty]}</Badge>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Instrucciones</h2>
            <p className="text-muted-foreground">Para realizar esta seña correctamente, sigue estos pasos:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Posiciona tus manos como se muestra en la imagen</li>
              <li>Realiza el movimiento de manera fluida y clara</li>
              <li>Mantén una postura corporal adecuada</li>
              <li>Practica la seña varias veces para mejorar tu precisión</li>
            </ul>
          </div>

          <Button size="lg" asChild>
            <Link href={`/practice?label=${label.id}`}>
              <Play className="mr-2 h-4 w-4" />
              Practicar esta seña
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
