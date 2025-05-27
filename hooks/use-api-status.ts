"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"

export function useApiStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    console.log("🔍 Checking API status...")
    const status = await apiService.checkHealth()
    setIsOnline(status)
    setLastChecked(new Date())
    console.log(`📡 API Status: ${status ? "Online" : "Offline"}`)
    return status
  }

  // Check status on mount and periodically
  useEffect(() => {
    checkStatus()

    // Check every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Check when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      // Only check if last check was more than 1 minute ago
      if (!lastChecked || Date.now() - lastChecked.getTime() > 60 * 1000) {
        checkStatus()
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [lastChecked])

  return {
    isOnline,
    lastChecked,
    checkStatus,
  }
}
