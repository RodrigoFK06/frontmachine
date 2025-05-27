"use client"

import { useRecords } from "@/hooks/use-records"
import { useLabels } from "@/hooks/use-labels"
import { useProgress } from "@/hooks/use-progress"
import { ProgressChart } from "@/components/progress-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function ProgressPage() {
  const { allRecords } = useRecords()
  const { labels } = useLabels()
  const { progressData, globalStats, isLoading: isProgressLoading } = useProgress()

  // Asegurarnos de que allRecords y labels sean arrays
  const safeRecords = Array.isArray(allRecords) ? allRecords : []
  const safeLabels = Array.isArray(labels) ? labels : []

  // Calculate statistics from records (fallback si no hay progressData de la API)
  const totalAttempts = safeRecords.length
  const correctCount = safeRecords.filter((r) => r.evaluation === "correct").length
  const doubtfulCount = safeRecords.filter((r) => r.evaluation === "doubtful").length
  const incorrectCount = safeRecords.filter((r) => r.evaluation === "incorrect").length

  const correctPercentage = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0
  const doubtfulPercentage = totalAttempts > 0 ? Math.round((doubtfulCount / totalAttempts) * 100) : 0
  const incorrectPercentage = totalAttempts > 0 ? Math.round((incorrectCount / totalAttempts) * 100) : 0

  // Usar datos de la API si están disponibles, sino usar cálculos locales
  const displayStats = globalStats || {
    total_attempts: totalAttempts,
    correct_percentage: correctPercentage,
    doubtful_percentage: doubtfulPercentage,
    incorrect_percentage: incorrectPercentage,
  }

  // Data for pie chart
  const pieData = [
    { name: "Correctos", value: correctCount, color: "#10b981" },
    { name: "Dudosos", value: doubtfulCount, color: "#f59e0b" },
    { name: "Incorrectos", value: incorrectCount, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  // Calculate statistics by label usando progressData de la API si está disponible
  let labelStats: any[] = []

  if (progressData.length > 0) {
    // Usar datos de la API
    labelStats = progressData.map((progress) => ({
      id: progress.label_name,
      name: progress.label_name,
      total: progress.total_attempts,
      correct: progress.correct_attempts,
      percentage: Math.round(progress.success_rate),
      category: safeLabels.find((l) => l.name === progress.label_name)?.category || "Desconocido",
    }))
  } else {
    // Fallback a cálculos locales
    labelStats = safeLabels
      .map((label) => {
        const labelRecords = safeRecords.filter((r) => r.expected_label === label.name)
        const total = labelRecords.length
        const correct = labelRecords.filter((r) => r.evaluation === "correct").length
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

        return {
          id: label.id,
          name: label.name,
          total,
          correct,
          percentage,
          category: label.category,
        }
      })
      .filter((stat) => stat.total > 0)
  }

  // Sort by most practiced
  const sortedLabelStats = [...labelStats].sort((a, b) => b.total - a.total)

  // Calcular número de señas practicadas
  const practicesSignsCount = labelStats.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Tu progreso</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Intentos totales</CardTitle>
              <CardDescription>Número total de prácticas</CardDescription>
            </CardHeader>
            <CardContent>
              {isProgressLoading ? (
                <Skeleton className="h-12 w-20" />
              ) : (
                <p className="text-4xl font-bold">{displayStats.total_attempts}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tasa de éxito</CardTitle>
              <CardDescription>Porcentaje de señas correctas</CardDescription>
            </CardHeader>
            <CardContent>
              {isProgressLoading ? (
                <Skeleton className="h-12 w-20" />
              ) : (
                <p className="text-4xl font-bold text-green-500">{displayStats.correct_percentage}%</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Señas practicadas</CardTitle>
              <CardDescription>Número de señas diferentes</CardDescription>
            </CardHeader>
            <CardContent>
              {isProgressLoading ? (
                <Skeleton className="h-12 w-20" />
              ) : (
                <p className="text-4xl font-bold">{practicesSignsCount}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProgressChart
            records={safeRecords}
            title="Actividad diaria"
            description="Resultados de tus prácticas en los últimos 7 días"
          />

          <Card>
            <CardHeader>
              <CardTitle>Distribución de resultados</CardTitle>
              <CardDescription>Proporción de evaluaciones por tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isProgressLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-48 w-48 rounded-full" />
                  </div>
                ) : totalAttempts > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No hay datos disponibles</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progreso por seña</CardTitle>
            <CardDescription>
              {progressData.length > 0
                ? "Estadísticas detalladas desde la API por cada seña practicada"
                : "Estadísticas calculadas localmente por cada seña practicada"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProgressLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : sortedLabelStats.length > 0 ? (
              <Tabs defaultValue="most-practiced">
                <TabsList className="mb-4">
                  <TabsTrigger value="most-practiced">Más practicadas</TabsTrigger>
                  <TabsTrigger value="best-performance">Mejor rendimiento</TabsTrigger>
                </TabsList>

                <TabsContent value="most-practiced">
                  <div className="space-y-4">
                    {sortedLabelStats.slice(0, 5).map((stat) => (
                      <div key={stat.id} className="flex items-center">
                        <div className="w-1/3">
                          <p className="font-medium">{stat.name}</p>
                          <p className="text-sm text-muted-foreground">{stat.category}</p>
                        </div>
                        <div className="w-1/3">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{stat.total} intentos</span>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className="bg-green-500 h-2.5 rounded-full"
                                style={{ width: `${stat.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{stat.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="best-performance">
                  <div className="space-y-4">
                    {[...labelStats]
                      .filter((stat) => stat.total >= 3) // At least 3 attempts
                      .sort((a, b) => b.percentage - a.percentage)
                      .slice(0, 5)
                      .map((stat) => (
                        <div key={stat.id} className="flex items-center">
                          <div className="w-1/3">
                            <p className="font-medium">{stat.name}</p>
                            <p className="text-sm text-muted-foreground">{stat.category}</p>
                          </div>
                          <div className="w-1/3">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{stat.total} intentos</span>
                            </div>
                          </div>
                          <div className="w-1/3">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                  className="bg-green-500 h-2.5 rounded-full"
                                  style={{ width: `${stat.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{stat.percentage}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
