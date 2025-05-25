"use client"

import { usePosters } from "@/context/poster-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ImageIcon, Plus, Car, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const { posters, loading } = usePosters()

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    )
  }

  const carPosters = posters.filter((poster) => poster.category === "Cars")
  const totalValue = posters.reduce((sum, poster) => sum + poster.price, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to your poster management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posters</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posters.length}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Car Posters</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carPosters.length}</div>
            <p className="text-xs text-muted-foreground">Automotive collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue}</div>
            <p className="text-xs text-muted-foreground">Total poster value</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/admin/posters/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Poster
            </Button>
          </Link>
          <Link href="/admin/posters">
            <Button variant="outline">
              <ImageIcon className="mr-2 h-4 w-4" />
              Manage Posters
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Posters */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posters</CardTitle>
          <CardDescription>Your latest additions</CardDescription>
        </CardHeader>
        <CardContent>
          {posters.length > 0 ? (
            <div className="space-y-2">
              {posters
                .slice(-5)
                .reverse()
                .map((poster) => (
                  <div key={poster.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{poster.title}</p>
                      <p className="text-sm text-gray-500">
                        {poster.category} - ₹{poster.price}
                      </p>
                    </div>
                    <Link href={`/admin/posters/edit/${poster.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No posters yet. Start by adding your first poster!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
