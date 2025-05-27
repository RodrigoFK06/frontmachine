"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/store/use-store"
import { apiService, getUserNickname, type PredictionRecord } from "@/lib/api"

type FilterOptions = {
  label?: string
  evaluation?: "correct" | "doubtful" | "incorrect"
  dateFrom?: Date
  dateTo?: Date
}

export function useRecords() {
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()
  const { records, setRecords } = useStore()
  const [filteredRecords, setFilteredRecords] = useState<PredictionRecord[]>([])
  const [filters, setFilters] = useState<FilterOptions>({})

  const fetchRecords = async (pageNum = 1, append = false): Promise<PredictionRecord[]> => {
    // Si no es append y ya tenemos records, usar los cached
    if (!append && Array.isArray(records) && records.length > 0) {
      console.log("📋 Using cached records:", records.length)
      applyFilters(records)
      return records
    }

    setIsLoading(true)

    try {
      console.log(`🔄 Fetching records from API (page ${pageNum})...`)

      const nickname = getUserNickname()

      // Llamada real a la API con fallback automático
      const fetchedRecords = await apiService.getRecords(nickname, pageNum, 50)

      console.log("✅ Records fetched successfully:", fetchedRecords.length)

      // Asegurar que tenemos un array válido
      const safeRecords = Array.isArray(fetchedRecords) ? fetchedRecords : []

      let allRecords: PredictionRecord[]
      if (append && Array.isArray(records)) {
        // Agregar nuevos records a los existentes
        allRecords = [...records, ...safeRecords]
      } else {
        // Reemplazar records existentes
        allRecords = safeRecords
      }

      setRecords(allRecords)
      applyFilters(allRecords)

      // Determinar si hay más páginas
      setHasMore(safeRecords.length === 50)

      return allRecords
    } catch (error) {
      console.error("❌ Error fetching records:", error)
      toast({
        title: "Error al cargar registros",
        description: "No se pudieron cargar los registros históricos. Usando datos de demostración.",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreRecords = async () => {
    if (!hasMore || isLoading) return

    const nextPage = page + 1
    setPage(nextPage)
    await fetchRecords(nextPage, true)
  }

  const applyFilters = (data: PredictionRecord[]) => {
    // Asegurarnos de que data sea un array
    const safeData = Array.isArray(data) ? data : []
    let filtered = [...safeData]

    if (filters.label) {
      filtered = filtered.filter(
        (record) => record.expected_label === filters.label || record.predicted_label === filters.label,
      )
    }

    if (filters.evaluation) {
      filtered = filtered.filter((record) => record.evaluation === filters.evaluation)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((record) => new Date(record.timestamp) >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((record) => new Date(record.timestamp) <= filters.dateTo!)
    }

    setFilteredRecords(filtered)
  }

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    // Asegurarnos de que records sea un array
    applyFilters(Array.isArray(records) ? records : [])
  }

  const clearFilters = () => {
    setFilters({})
    // Asegurarnos de que records sea un array
    setFilteredRecords(Array.isArray(records) ? records : [])
  }

  // Cargar los registros al montar el componente
  useEffect(() => {
    fetchRecords()
  }, [])

  // Aplicar filtros cuando cambien los filtros o los registros
  useEffect(() => {
    if (Array.isArray(records)) {
      applyFilters(records)
    } else {
      setFilteredRecords([])
    }
  }, [filters, records])

  return {
    records: filteredRecords,
    allRecords: Array.isArray(records) ? records : [],
    isLoading,
    hasMore,
    filters,
    updateFilters,
    clearFilters,
    fetchRecords,
    loadMoreRecords,
  }
}
