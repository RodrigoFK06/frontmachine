"use client"

import { useState } from "react"
import { HistoryTable } from "@/components/history-table"
import { useRecords } from "@/hooks/use-records"
import { useLabels } from "@/hooks/use-labels"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, FilterX } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HistoryPage() {
  const { records, isLoading, filters, updateFilters, clearFilters } = useRecords()
  const { labels } = useLabels()
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  // Asegurarnos de que labels sea un array
  const safeLabels = Array.isArray(labels) ? labels : []

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date)
    if (date) {
      updateFilters({ dateFrom: date })
    }
  }

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date)
    if (date) {
      updateFilters({ dateTo: date })
    }
  }

  const handleLabelChange = (value: string) => {
    updateFilters({ label: value === "all" ? undefined : value })
  }

  const handleEvaluationChange = (value: string) => {
    updateFilters({
      evaluation: value === "all" ? undefined : (value as "correct" | "doubtful" | "incorrect"),
    })
  }

  const handleClearFilters = () => {
    clearFilters()
    setFromDate(undefined)
    setToDate(undefined)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Historial de práctica</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra tu historial de práctica por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="label-filter">Seña</Label>
              <Select onValueChange={handleLabelChange} defaultValue="all">
                <SelectTrigger id="label-filter">
                  <SelectValue placeholder="Todas las señas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las señas</SelectItem>
                  {safeLabels.map((label) => (
                    <SelectItem key={label.id} value={label.name}>
                      {label.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation-filter">Evaluación</Label>
              <Select onValueChange={handleEvaluationChange} defaultValue="all">
                <SelectTrigger id="evaluation-filter">
                  <SelectValue placeholder="Todas las evaluaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="correct">Correctas</SelectItem>
                  <SelectItem value="doubtful">Dudosas</SelectItem>
                  <SelectItem value="incorrect">Incorrectas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">Desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-from"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromDateChange}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-to"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={handleToDateChange} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
            <FilterX className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        </CardContent>
      </Card>

      <HistoryTable records={records} isLoading={isLoading} />
    </div>
  )
}
