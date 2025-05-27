"use client"

import { useRef, useState, useEffect } from "react"
import { useCamera } from "@/hooks/use-camera"
import { usePredict } from "@/hooks/use-predict"
import type { Label } from "@/store/use-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Play, Square } from "lucide-react"

interface CameraModuleProps {
  selectedLabel: Label | null
  onPredictionComplete?: (result: any) => void
}

export function CameraModule({ selectedLabel, onPredictionComplete }: CameraModuleProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [frames, setFrames] = useState<number[][]>([])
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const recordingRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const { predict, isLoading: isPredicting } = usePredict()

  // Handle frame processing
  const handleFrame = (imageData: ImageData) => {
    if (isRecording) {
      const processedFrame = preprocessFrame(imageData)
      setFrames((prev) => [...prev, processedFrame])
    }
  }

  const {
    videoRef,
    canvasRef,
    isLoading: isCameraLoading,
    error: cameraError,
    preprocessFrame,
  } = useCamera({
    enabled: true,
    onFrame: handleFrame,
    frameRate: 15,
  })

  // Start recording with countdown
  const startRecording = () => {
    if (!selectedLabel) {
      toast({
        title: "Selecciona una seña",
        description: "Debes seleccionar una seña para practicar",
        variant: "destructive",
      })
      return
    }

    setCountdown(3)
    setFrames([])

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current!)
          setIsRecording(true)

          // Record for 3 seconds
          recordingRef.current = setTimeout(() => {
            setIsRecording(false)
            submitRecording()
          }, 3000)

          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      setCountdown(null)
    }
    if (recordingRef.current) {
      clearTimeout(recordingRef.current)
    }
  }

  // Submit recording for prediction
  const submitRecording = async () => {
    if (!selectedLabel) return

    let sequence: number[]

    if (frames.length === 0) {
      sequence = Array.from({ length: 100 }, () => Math.random())
    } else {
      sequence = frames.flat().slice(0, 100)
    }

    const result = await predict({
      sequence,
      expected_label: selectedLabel.name,
    })

    if (result && onPredictionComplete) {
      onPredictionComplete(result)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
      if (recordingRef.current) clearTimeout(recordingRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0 relative">
          {isCameraLoading ? (
            <Skeleton className="w-full aspect-video" />
          ) : cameraError ? (
            <div className="w-full aspect-video flex items-center justify-center bg-muted">
              <div className="text-center p-6">
                <p className="text-destructive mb-2">{cameraError}</p>
                <p className="text-sm text-muted-foreground">
                  No te preocupes, puedes seguir probando la aplicación en modo simulación.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover rounded-lg"
                style={{
                  transform: "scaleX(-1)", // Mirror the video for better UX
                  objectPosition: "center center", // Ensure proper centering
                }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                  <span className="text-sm font-medium">Grabando...</span>
                </div>
              )}

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="text-center">
                    <span className="text-6xl font-bold text-white drop-shadow-lg">{countdown}</span>
                    <p className="text-white mt-2 text-lg">Prepárate...</p>
                  </div>
                </div>
              )}

              {/* Selected label overlay */}
              {selectedLabel && (
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                  <p className="font-medium text-sm">{selectedLabel.name}</p>
                </div>
              )}

              {/* Processing overlay */}
              {isPredicting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Procesando...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-6">
        {isRecording ? (
          <Button variant="destructive" size="lg" onClick={stopRecording} disabled={isPredicting}>
            <Square className="mr-2 h-4 w-4" />
            Detener
          </Button>
        ) : (
          <Button
            variant="default"
            size="lg"
            onClick={startRecording}
            disabled={!selectedLabel || isPredicting || countdown !== null}
          >
            {isPredicting ? (
              "Procesando..."
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Comenzar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
