"use client"

import { useAnalytics } from "@/context/analytics-context"
import { usePosters } from "@/context/poster-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SimpleChart } from "@/components/analytics/simple-chart"
import { Eye, MousePointer, TrendingUp, Users, Calendar, BarChart3, Trash2 } from "lucide-react"
import { useState } from "react"

export default function AnalyticsPage() {
  const { analytics, getTopPosters, getCategoryStats, getViewsOverTime, clearAnalytics } = useAnalytics()
  const { posters } = usePosters()
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7)

  const topPosters = getTopPosters(10)
  const categoryStats = getCategoryStats()
  const viewsOverTime = getViewsOverTime(timeRange)

  const handleClearAnalytics = () => {
    if (confirm("Are you sure you want to clear all analytics data? This action cannot be undone.")) {
      clearAnalytics()
    }
  }

  // Calculate conversion rate (clicks / views)
  const conversionRate =
    analytics.totalViews > 0 ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1) : "0"

  // Get most popular source
  const sourceCounts = analytics.views.reduce(
    (acc, view) => {
      acc[view.source] = (acc[view.source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const topSource = Object.entries(sourceCounts).sort(([, a], [, b]) => b - a)[0]

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
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">All time poster views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
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
            <div className="text-2xl font-bold">{analytics.uniqueViews}</div>
            <p className="text-xs text-muted-foreground">Posters with views</p>
          </CardContent>
        </Card>
      </div>

      {/* Views Over Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Daily views and clicks for the last {timeRange} days</CardDescription>
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
            <SimpleChart
              data={viewsOverTime.map((item) => ({
                label: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                value: item.views + item.clicks,
              }))}
              type="line"
              height={250}
            />
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
                {topPosters.slice(0, 5).map((poster, index) => (
                  <div key={poster.posterId} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[200px]" title={poster.posterTitle}>
                          {poster.posterTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {poster.views} views • {poster.clicks} clicks
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{poster.views + poster.clicks}</p>
                      <p className="text-xs text-gray-500">total interactions</p>
                    </div>
                  </div>
                ))}
                {topPosters.length > 5 && (
                  <SimpleChart
                    data={topPosters.slice(0, 8).map((poster) => ({
                      label: poster.posterTitle.split(" ").slice(0, 2).join(" "),
                      value: poster.views + poster.clicks,
                    }))}
                    type="bar"
                    height={200}
                  />
                )}
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
            {categoryStats.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.map((category, index) => (
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
                      <p className="text-sm font-medium">{category.views + category.clicks}</p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                  </div>
                ))}
                <SimpleChart
                  data={categoryStats.map((category, index) => ({
                    label: category.category,
                    value: category.views + category.clicks,
                    color: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][index % 4],
                  }))}
                  type="bar"
                  height={200}
                />
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

      {/* Traffic Sources */}
      {Object.keys(sourceCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where users discover your posters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(sourceCounts).map(([source, count]) => (
                <div key={source} className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-gray-500 capitalize">{source}</p>
                  {topSource && source === topSource[0] && <p className="text-xs text-green-600 mt-1">Top source</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
