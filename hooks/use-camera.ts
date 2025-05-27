"use client"

import { useState, useEffect, useRef } from "react"

type UseCameraOptions = {
  enabled?: boolean
  onFrame?: (imageData: ImageData) => void
  frameRate?: number
}

export function useCamera({ enabled = true, onFrame, frameRate = 10 }: UseCameraOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameLoopRef = useRef<number | null>(null)

  // Initialize camera
  useEffect(() => {
    if (!enabled) return

    const initCamera = async () => {
      setIsLoading(true)
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        })
        setStream(mediaStream)
        setError(null)
      } catch (err) {
        setError("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
        console.error("Error accessing camera:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (frameLoopRef.current) {
        cancelAnimationFrame(frameLoopRef.current)
      }
    }
  }, [enabled])

  // Set up video stream
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream, videoRef])

  // Process frames
  useEffect(() => {
    if (!stream || !videoRef.current || !canvasRef.current || !onFrame) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    let lastFrameTime = 0
    const interval = 1000 / frameRate

    const processFrame = (timestamp: number) => {
      if (timestamp - lastFrameTime >= interval) {
        // Only process frames at the specified frame rate
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Set canvas dimensions to match video
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Draw video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Get image data and pass to callback
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          onFrame(imageData)
        }
        lastFrameTime = timestamp
      }

      frameLoopRef.current = requestAnimationFrame(processFrame)
    }

    video.onloadedmetadata = () => {
      frameLoopRef.current = requestAnimationFrame(processFrame)
    }

    return () => {
      if (frameLoopRef.current) {
        cancelAnimationFrame(frameLoopRef.current)
      }
    }
  }, [stream, onFrame, frameRate])

  // Mock function to simulate preprocessing frames to LSTM sequence.
  // Each call to this function represents one row (42 features)
  // of the final 35x42 matrix expected by the LSTM model.
  const preprocessFrame = (imageData: ImageData): number[] => {
    // In a real implementation, this would use TensorFlow.js or similar
    // to extract pose keypoints and convert to a sequence.
    // For now, we return a mock sequence of 42 random floats.
    return Array.from({ length: 42 }, () => Math.random())
  }

  return {
    videoRef,
    canvasRef,
    stream,
    error,
    isLoading,
    preprocessFrame,
  }
}
