"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface PosterView {
  posterId: string
  timestamp: number
  source: string
}

interface PosterClick {
  posterId: string
  timestamp: number
  action: string
}

interface AnalyticsData {
  views: PosterView[]
  clicks: PosterClick[]
}

interface AnalyticsContextType {
  trackView: (posterId: string, source: string) => void
  trackClick: (posterId: string, action: string) => void
  getAnalytics: () => AnalyticsData
  clearAnalytics: () => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    views: [],
    clicks: [],
  })
  const [isClient, setIsClient] = useState(false)

  // Set client flag after mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load analytics from localStorage only on client
  useEffect(() => {
    if (!isClient) return

    try {
      const saved = localStorage.getItem("poster-analytics")
      if (saved) {
        const parsedData = JSON.parse(saved)
        setAnalytics(parsedData)
      }
    } catch (error) {
      console.error("Failed to load analytics:", error)
    }
  }, [isClient])

  // Save analytics to localStorage when data changes (client only)
  useEffect(() => {
    if (!isClient) return

    try {
      localStorage.setItem("poster-analytics", JSON.stringify(analytics))
    } catch (error) {
      console.error("Failed to save analytics:", error)
    }
  }, [analytics, isClient])

  const trackView = useCallback(
    (posterId: string, source: string) => {
      if (!isClient) return

      setAnalytics((prev) => ({
        ...prev,
        views: [...prev.views, { posterId, timestamp: Date.now(), source }],
      }))
    },
    [isClient],
  )

  const trackClick = useCallback(
    (posterId: string, action: string) => {
      if (!isClient) return

      setAnalytics((prev) => ({
        ...prev,
        clicks: [...prev.clicks, { posterId, timestamp: Date.now(), action }],
      }))
    },
    [isClient],
  )

  const getAnalytics = useCallback(() => analytics, [analytics])

  const clearAnalytics = useCallback(() => {
    setAnalytics({ views: [], clicks: [] })
    if (isClient) {
      try {
        localStorage.removeItem("poster-analytics")
      } catch (error) {
        console.error("Failed to clear analytics:", error)
      }
    }
  }, [isClient])

  return (
    <AnalyticsContext.Provider value={{ trackView, trackClick, getAnalytics, clearAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
