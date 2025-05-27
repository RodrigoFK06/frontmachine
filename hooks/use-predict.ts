"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useStore, type PredictionRecord } from "@/store/use-store"
import { apiService, getUserNickname, type PredictionRequest, type PredictionResponse } from "@/lib/api"

export function usePredict() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const addRecord = useStore((state) => state.addRecord)

  const predict = async (data: Omit<PredictionRequest, "nickname">): Promise<PredictionResponse | null> => {
    setIsLoading(true)

    try {
      // Simulamos un pequeño retraso para UX
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Preparar datos para la API incluyendo nickname
      const requestData: PredictionRequest = {
        ...data,
        nickname: getUserNickname(),
      }

      console.log("🔮 Sending prediction request:", {
        expected_label: requestData.expected_label,
        nickname: requestData.nickname,
        sequence_length: requestData.sequence.length,
      })

      // Llamada real a la API con fallback automático
      const response = await apiService.predict(requestData)

      console.log("📊 Prediction response:", response)

      // Crear registro para el store local
      const record: PredictionRecord = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        expected_label: requestData.expected_label,
        predicted_label: response.predicted_label,
        confidence: response.confidence,
        evaluation: response.evaluation,
        observation: response.observation,
        success_rate: response.success_rate,
        average_confidence: response.average_confidence,
      }

      // Añadir al store local para feedback inmediato
      addRecord(record)

      return response
    } catch (error) {
      console.error("❌ Error in prediction:", error)
      toast({
        title: "Error de predicción",
        description: "Ocurrió un error al procesar la predicción. Usando datos de demostración.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    predict,
    isLoading,
  }
}
