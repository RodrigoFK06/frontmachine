"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PredictionRecord } from "@/store/use-store"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ProgressChartProps {
  records: PredictionRecord[]
  title: string
  description?: string
}

export function ProgressChart({ records, title, description }: ProgressChartProps) {
  // Asegurarnos de que records sea un array
  const safeRecords = Array.isArray(records) ? records : []

  // Process data for chart
  const processData = () => {
    // Get last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        date,
        dateStr: format(date, "dd MMM", { locale: es }),
        correct: 0,
        doubtful: 0,
        incorrect: 0,
        total: 0,
      }
    })

    // Map records to days
    safeRecords.forEach((record) => {
      const recordDate = new Date(record.timestamp)
      const dayIndex = days.findIndex(
        (day) =>
          recordDate.getDate() === day.date.getDate() &&
          recordDate.getMonth() === day.date.getMonth() &&
          recordDate.getFullYear() === day.date.getFullYear(),
      )

      if (dayIndex !== -1) {
        days[dayIndex][record.evaluation] += 1
        days[dayIndex].total += 1
      }
    })

    return days.map((day) => ({
      name: day.dateStr,
      Correctos: day.correct,
      Dudosos: day.doubtful,
      Incorrectos: day.incorrect,
      total: day.total,
    }))
  }

  const data = processData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Correctos" stackId="a" fill="#10b981" />
              <Bar dataKey="Dudosos" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Incorrectos" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
