"use client"

import { useState } from "react"
import { apiService, getUserNickname, type DailyActivity } from "@/lib/api"

/**
 * Hook to fetch and manage daily activity data.
 * Note: This hook is currently not used in any active UI component (as of YYYY-MM-DD),
 * but is implemented and ready for future integration (e.g., for a calendar view
 * or detailed daily activity breakdown).
 */
export function useDailyActivity() {
  const [isLoading, setIsLoading] = useState(false)
  const [activityCache, setActivityCache] = useState<Map<string, DailyActivity>>(new Map())

  const getDailyActivity = async (date: Date): Promise<DailyActivity> => {
    const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD format

    // Verificar cache primero
    if (activityCache.has(dateStr)) {
      console.log(`📋 Using cached activity for ${dateStr}`)
      return activityCache.get(dateStr)!
    }

    setIsLoading(true)

    try {
      console.log(`🔄 Fetching daily activity for ${dateStr}...`)

      const nickname = getUserNickname()

      // Llamada real a la API con fallback automático
      const activity = await apiService.getDailyActivity(nickname, dateStr)

      console.log(`✅ Daily activity fetched for ${dateStr}:`, activity)

      // Guardar en cache
      setActivityCache((prev) => new Map(prev).set(dateStr, activity))

      return activity
    } catch (error) {
      console.error(`❌ Error fetching daily activity for ${dateStr}:`, error)

      // Fallback local si falla completamente
      const fallbackActivity: DailyActivity = {
        date: dateStr,
        total_practices: 0,
        correct: 0,
        doubtful: 0,
        incorrect: 0,
      }

      return fallbackActivity
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityRange = async (startDate: Date, endDate: Date): Promise<DailyActivity[]> => {
    const activities: DailyActivity[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const activity = await getDailyActivity(new Date(currentDate))
      activities.push(activity)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return activities
  }

  return {
    isLoading,
    getDailyActivity,
    getActivityRange,
    activityCache,
  }
}
