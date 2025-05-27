"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { apiService, getUserNickname, type ProgressData, type GlobalStats } from "@/lib/api"

export function useProgress() {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProgress = async (): Promise<ProgressData[]> => {
    setIsLoading(true)

    try {
      console.log("🔄 Fetching progress from API...")

      const nickname = getUserNickname()

      // Llamada real a la API con fallback automático
      const fetchedProgress = await apiService.getProgress(nickname)

      console.log("✅ Progress fetched successfully:", fetchedProgress.length)

      // Asegurar que tenemos un array válido
      const safeProgress = Array.isArray(fetchedProgress) ? fetchedProgress : []

      setProgressData(safeProgress)

      return safeProgress
    } catch (error) {
      console.error("❌ Error fetching progress:", error)
      toast({
        title: "Error al cargar progreso",
        description: "No se pudo cargar el progreso. Usando datos de demostración.",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGlobalStats = async (): Promise<GlobalStats | null> => {
    try {
      console.log("🔄 Fetching global stats from API...")

      // Llamada real a la API con fallback automático
      const fetchedStats = await apiService.getGlobalStats()

      console.log("✅ Global stats fetched successfully:", fetchedStats)

      setGlobalStats(fetchedStats)

      return fetchedStats
    } catch (error) {
      console.error("❌ Error fetching global stats:", error)
      return null
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchProgress()
    fetchGlobalStats()
  }, [])

  return {
    progressData,
    globalStats,
    isLoading,
    fetchProgress,
    fetchGlobalStats,
  }
}
