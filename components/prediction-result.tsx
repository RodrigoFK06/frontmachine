"use client"

import { CheckCircle, AlertTriangle, XCircle, RotateCcw, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PredictionResultProps {
  result: {
    predicted_label: string
    confidence: number
    evaluation: "correct" | "doubtful" | "incorrect"
    observation: string
    success_rate?: number
    average_confidence?: number
  } | null
  expectedLabel: string
  onClose: () => void
  onRepeat?: () => void
  onNextLesson?: () => void
}

export function PredictionResult({ result, expectedLabel, onClose, onRepeat, onNextLesson }: PredictionResultProps) {
  if (!result) return null

  const getEvaluationDetails = () => {
    switch (result.evaluation) {
      case "correct":
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: "¡Correcto!",
          description: "Has realizado la seña correctamente.",
          color: "bg-green-500",
        }
      case "doubtful":
        return {
          icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
          title: "Casi correcto",
          description: "La seña es reconocible pero puede mejorar.",
          color: "bg-amber-500",
        }
      case "incorrect":
        return {
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          title: "Incorrecto",
          description: "La seña no ha sido reconocida correctamente.",
          color: "bg-red-500",
        }
      default:
        return {
          icon: null,
          title: "Resultado",
          description: "Evaluación de la seña realizada.",
          color: "bg-primary",
        }
    }
  }

  const details = getEvaluationDetails()
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-t-4" style={{ borderTopColor: details.color.replace("bg-", "") }}>
          <CardHeader className="flex flex-row items-center gap-4">
            {details.icon}
            <div>
              <CardTitle>{details.title}</CardTitle>
              <CardDescription>{details.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Seña esperada:</span>
                <span className="font-medium">{expectedLabel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Seña detectada:</span>
                <span className="font-medium">{result.predicted_label}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Confianza:</span>
                <span className="font-medium">{confidencePercent}%</span>
              </div>
              <Progress
                value={confidencePercent}
                className={cn(
                  confidencePercent > 80 ? "bg-green-100" : confidencePercent > 50 ? "bg-amber-100" : "bg-red-100",
                )}
              />
            </div>

            {result.observation && (
              <div className="text-sm mt-4 p-3 bg-muted rounded-md">
                <p className="font-medium mb-1">Observación:</p>
                <p>{result.observation}</p>
              </div>
            )}

            {(result.success_rate !== undefined || result.average_confidence !== undefined) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {result.success_rate !== undefined && (
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Tasa de éxito</p>
                    <p className="text-xl font-bold">{Math.round(result.success_rate)}%</p>
                  </div>
                )}
                {result.average_confidence !== undefined && (
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Confianza media</p>
                    <p className="text-xl font-bold">{Math.round(result.average_confidence * 100)}%</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {/* Botones principales de navegación */}
            <div className="flex gap-3 w-full">
              {onRepeat && (
                <Button onClick={onRepeat} variant="outline" className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Repetir
                </Button>
              )}
              {onNextLesson && (
                <Button onClick={onNextLesson} className="flex-1">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Siguiente lección
                </Button>
              )}
            </div>

            {/* Botón secundario para continuar practicando */}
            <Button onClick={onClose} variant="ghost" className="w-full">
              Continuar practicando
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
