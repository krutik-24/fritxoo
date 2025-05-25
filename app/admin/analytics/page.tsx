"use client"

import { useAnalytics } from "@/context/analytics-context"
import { usePosters } from "@/context/poster-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, MousePointer, TrendingUp, Users, Calendar, BarChart3, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7)

  // Ensure component is mounted before accessing analytics
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return <AnalyticsContent timeRange={timeRange} setTimeRange={setTimeRange} />
}

function AnalyticsContent({
  timeRange,
  setTimeRange,
}: {
  timeRange: 7 | 14 | 30
  setTimeRange: (range: 7 | 14 | 30) => void
}) {
  const { getAnalytics, clearAnalytics } = useAnalytics()
  const { posters } = usePosters()

  const analytics = getAnalytics()
  const totalViews = analytics.views.length
  const totalClicks = analytics.clicks.length
  const uniqueViews = new Set(analytics.views.map((v) => v.posterId)).size
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0"

  // Get top posters
  const posterStats = new Map<string, { title: string; views: number; clicks: number }>()

  analytics.views.forEach((view) => {
    const poster = posters.find((p) => p.id === view.posterId)
    if (poster) {
      const existing = posterStats.get(view.posterId) || { title: poster.title, views: 0, clicks: 0 }
      posterStats.set(view.posterId, { ...existing, views: existing.views + 1 })
    }
  })

  analytics.clicks.forEach((click) => {
    const poster = posters.find((p) => p.id === click.posterId)
    if (poster) {
      const existing = posterStats.get(click.posterId) || { title: poster.title, views: 0, clicks: 0 }
      posterStats.set(click.posterId, { ...existing, clicks: existing.clicks + 1 })
    }
  })

  const topPosters = Array.from(posterStats.entries())
    .map(([id, stats]) => ({ id, ...stats, total: stats.views + stats.clicks }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  // Get category stats
  const categoryStats = new Map<string, { views: number; clicks: number }>()

  analytics.views.forEach((view) => {
    const poster = posters.find((p) => p.id === view.posterId)
    if (poster) {
      const existing = categoryStats.get(poster.category) || { views: 0, clicks: 0 }
      categoryStats.set(poster.category, { ...existing, views: existing.views + 1 })
    }
  })

  analytics.clicks.forEach((click) => {
    const poster = posters.find((p) => p.id === click.posterId)
    if (poster) {
      const existing = categoryStats.get(poster.category) || { views: 0, clicks: 0 }
      categoryStats.set(poster.category, { ...existing, clicks: existing.clicks + 1 })
    }
  })

  const topCategories = Array.from(categoryStats.entries())
    .map(([category, stats]) => ({ category, ...stats, total: stats.views + stats.clicks }))
    .sort((a, b) => b.total - a.total)

  // Get views over time
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const startTime = now - timeRange * dayMs

  const dailyStats = new Map<string, { views: number; clicks: number }>()

  // Initialize all days
  for (let i = 0; i < timeRange; i++) {
    const date = new Date(now - i * dayMs).toISOString().split("T")[0]
    dailyStats.set(date, { views: 0, clicks: 0 })
  }

  // Count views and clicks
  analytics.views
    .filter((view) => view.timestamp >= startTime)
    .forEach((view) => {
      const date = new Date(view.timestamp).toISOString().split("T")[0]
      const existing = dailyStats.get(date) || { views: 0, clicks: 0 }
      dailyStats.set(date, { ...existing, views: existing.views + 1 })
    })

  analytics.clicks
    .filter((click) => click.timestamp >= startTime)
    .forEach((click) => {
      const date = new Date(click.timestamp).toISOString().split("T")[0]
      const existing = dailyStats.get(date) || { views: 0, clicks: 0 }
      dailyStats.set(date, { ...existing, clicks: existing.clicks + 1 })
    })

  const viewsOverTime = Array.from(dailyStats.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const handleClearAnalytics = () => {
    if (confirm("Are you sure you want to clear all analytics data? This action cannot be undone.")) {
      clearAnalytics()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track poster views and performance metrics</p>
        </div>
        <Button variant="outline" onClick={handleClearAnalytics} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">All time poster views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">User interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Clicks per view</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Posters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueViews}</div>
            <p className="text-xs text-muted-foreground">Posters with views</p>
          </CardContent>
        </Card>
      </div>

      {/* Views Over Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Over Time</CardTitle>
              <CardDescription>Views and clicks for the last {timeRange} days</CardDescription>
            </div>
            <div className="flex gap-2">
              {[7, 14, 30].map((days) => (
                <Button
                  key={days}
                  variant={timeRange === days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(days as 7 | 14 | 30)}
                >
                  {days}d
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewsOverTime.length > 0 ? (
            <div className="space-y-4">
              {viewsOverTime.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="flex gap-4 text-sm">
                    <span>{day.views} views</span>
                    <span>{day.clicks} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <p>No data available for the selected time range</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posters */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posters</CardTitle>
            <CardDescription>Most viewed and clicked posters</CardDescription>
          </CardHeader>
          <CardContent>
            {topPosters.length > 0 ? (
              <div className="space-y-4">
                {topPosters.map((poster, index) => (
                  <div key={poster.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[200px]" title={poster.title}>
                          {poster.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {poster.views} views • {poster.clicks} clicks
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{poster.total}</p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                <p>No poster interactions yet</p>
                <p className="text-sm">Start tracking by viewing posters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Views and clicks by category</CardDescription>
          </CardHeader>
          <CardContent>
            {topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][index % 4] }}
                      />
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-gray-500">
                          {category.views} views • {category.clicks} clicks
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{category.total}</p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                <p>No category data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
