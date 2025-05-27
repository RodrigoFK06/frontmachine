"use client"

import { useState } from "react"
import type { PredictionRecord } from "@/store/use-store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface HistoryTableProps {
  records: PredictionRecord[]
  isLoading?: boolean
}

export function HistoryTable({ records, isLoading = false }: HistoryTableProps) {
  const [sortField, setSortField] = useState<keyof PredictionRecord>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Asegurarnos de que records sea un array
  const safeRecords = Array.isArray(records) ? records : []

  const handleSort = (field: keyof PredictionRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedRecords = [...safeRecords].sort((a, b) => {
    if (sortField === "timestamp") {
      return sortDirection === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }

    if (sortField === "confidence" || sortField === "success_rate" || sortField === "average_confidence") {
      const aValue = a[sortField] || 0
      const bValue = b[sortField] || 0
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    const aValue = String(a[sortField])
    const bValue = String(b[sortField])
    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  const getEvaluationBadge = (evaluation: string) => {
    switch (evaluation) {
      case "correct":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Correcto
          </Badge>
        )
      case "doubtful":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Dudoso
          </Badge>
        )
      case "incorrect":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Incorrecto
          </Badge>
        )
      default:
        return <Badge variant="outline">{evaluation}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es })
    } catch (e) {
      return dateString
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando registros...</div>
  }

  if (safeRecords.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No hay registros disponibles</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("timestamp")}
                className="flex items-center font-medium"
              >
                Fecha
                {sortField === "timestamp" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("expected_label")}
                className="flex items-center font-medium"
              >
                Seña esperada
                {sortField === "expected_label" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("predicted_label")}
                className="flex items-center font-medium"
              >
                Seña detectada
                {sortField === "predicted_label" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("confidence")}
                className="flex items-center font-medium ml-auto"
              >
                Confianza
                {sortField === "confidence" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("evaluation")}
                className="flex items-center font-medium"
              >
                Evaluación
                {sortField === "evaluation" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{formatDate(record.timestamp)}</TableCell>
              <TableCell>{record.expected_label}</TableCell>
              <TableCell>{record.predicted_label}</TableCell>
              <TableCell className="text-right">{Math.round(record.confidence * 100)}%</TableCell>
              <TableCell>{getEvaluationBadge(record.evaluation)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Practicar de nuevo</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
