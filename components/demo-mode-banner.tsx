"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, X, Wifi } from "lucide-react"
import { useApiStatus } from "@/hooks/use-api-status"

export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const { isOnline, checkStatus } = useApiStatus()

  useEffect(() => {
    // Mostrar banner si la API está offline y no ha sido dismisseado
    const dismissed = localStorage.getItem("demo-banner-dismissed") === "true"
    setIsDismissed(dismissed)
    setIsVisible(isOnline === false && !dismissed)
  }, [isOnline])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("demo-banner-dismissed", "true")
  }

  const handleRetry = async () => {
    const status = await checkStatus()
    if (status) {
      setIsVisible(false)
      localStorage.removeItem("demo-banner-dismissed")
    }
  }

  if (!isVisible) return null

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium text-amber-800 dark:text-amber-200">Modo Demostración Activo</span>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            No se pudo conectar con la API. Estás usando datos de demostración. Todas las funciones están disponibles.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={handleRetry} className="text-amber-700 border-amber-300">
            <Wifi className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-amber-700">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
