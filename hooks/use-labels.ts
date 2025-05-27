"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/store/use-store"
import { apiService, type Label } from "@/lib/api"

export function useLabels() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { labels, setLabels, setError } = useStore()

  const fetchLabels = async (): Promise<Label[]> => {
    // Verificar si ya tenemos labels cargados
    if (Array.isArray(labels) && labels.length > 0) {
      console.log("📋 Using cached labels:", labels.length)
      return labels
    }

    setIsLoading(true)

    try {
      console.log("🔄 Fetching labels from API...")

      // Llamada real a la API con fallback automático
      const fetchedLabels = await apiService.getLabels()

      console.log("✅ Labels fetched successfully:", fetchedLabels.length)

      // Asegurar que tenemos un array válido
      const safeLabels = Array.isArray(fetchedLabels) ? fetchedLabels : []

      setLabels(safeLabels)
      setError(null)

      return safeLabels
    } catch (error) {
      console.error("❌ Error fetching labels:", error)
      setError("Error al cargar etiquetas")
      toast({
        title: "Error al cargar señas",
        description: "No se pudieron cargar las señas. Usando datos de demostración.",
        variant: "destructive",
      })

      // Devolver array vacío en caso de error total
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar las etiquetas al montar el componente
  useEffect(() => {
    fetchLabels()
  }, [])

  return {
    // Asegurarnos de que labels siempre sea un array
    labels: Array.isArray(labels) ? labels : [],
    isLoading,
    fetchLabels,
  }
}
