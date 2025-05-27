"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Database, Clock, TrendingUp } from "lucide-react"

interface ApiUsageStats {
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  averageResponseTime: number
  lastSuccessfulCall: Date | null
  cacheHitRate: number
}

export function ApiUsageStats() {
  const [stats, setStats] = useState<ApiUsageStats>({
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageResponseTime: 0,
    lastSuccessfulCall: null,
    cacheHitRate: 0,
  })

  useEffect(() => {
    // En una implementación real, estos datos vendrían de un contexto o store
    // Por ahora simulamos algunos datos
    const mockStats: ApiUsageStats = {
      totalCalls: 47,
      successfulCalls: 42,
      failedCalls: 5,
      averageResponseTime: 245,
      lastSuccessfulCall: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      cacheHitRate: 78,
    }
    setStats(mockStats)
  }, [])

  const successRate = stats.totalCalls > 0 ? (stats.successfulCalls / stats.totalCalls) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Estadísticas de API
        </CardTitle>
        <CardDescription>Estado y rendimiento de la conexión con el servidor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Llamadas totales</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalCalls}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tasa de éxito</span>
            </div>
            <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Éxito de llamadas</span>
            <span>
              {stats.successfulCalls}/{stats.totalCalls}
            </span>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tiempo promedio</span>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {stats.averageResponseTime}ms
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cache hit rate</span>
            <Badge variant="outline">{stats.cacheHitRate}%</Badge>
          </div>
        </div>

        {stats.lastSuccessfulCall && (
          <div className="text-xs text-muted-foreground">
            Última conexión exitosa: {stats.lastSuccessfulCall.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
