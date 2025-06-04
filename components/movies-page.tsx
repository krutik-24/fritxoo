"use client"

import { useState, useEffect } from "react"
import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Film, Star, Grid3X3, Grid2X2, LayoutGrid } from "lucide-react"
import Link from "next/link"

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name-a-z" | "name-z-a"
type GridSize = "small" | "medium" | "large"

export default function MoviesPage() {
  const { getPostersByCategory, loading } = usePosters()
  const [moviePosters, setMoviePosters] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [gridSize, setGridSize] = useState<GridSize>("medium")
  const [currentPage, setCurrentPage] = useState(1)
  const postersPerPage = 12

  useEffect(() => {
    const posters = getPostersByCategory("movies")
    console.log("Movie posters found:", posters.length)
    setMoviePosters(posters)
  }, [getPostersByCategory])

  // Sort posters
  const sortedPosters = [...moviePosters].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.dateCreated || "2023-01-01").getTime() - new Date(a.dateCreated || "2023-01-01").getTime()
      case "oldest":
        return new Date(a.dateCreated || "2023-01-01").getTime() - new Date(b.dateCreated || "2023-01-01").getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name-a-z":
        return a.title.localeCompare(b.title)
      case "name-z-a":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedPosters.length / postersPerPage)
  const startIndex = (currentPage - 1) * postersPerPage
  const endIndex = startIndex + postersPerPage
  const currentPosters = sortedPosters.slice(startIndex, endIndex)

  // Grid size classes
  const getGridClasses = () => {
    switch (gridSize) {
      case "small":
        return "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
      case "medium":
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
      case "large":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      default:
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading movie posters...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/shop">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-blue-300" />
              <h1 className="text-4xl md:text-5xl font-bold">Movie Posters</h1>
            </div>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl">
            Discover our premium collection of movie posters featuring classic films, blockbusters, and iconic cinema
            moments.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-blue-200">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-medium">{moviePosters.length} Premium Designs</span>
            </div>
            <div className="text-blue-200">•</div>
            <div className="text-blue-200">A4 (₹99) & A3 (₹149)</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {moviePosters.length} movie poster{moviePosters.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort:</span>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                    <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={gridSize === "small" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("small")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridSize === "medium" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("medium")}
                  className="h-8 w-8 p-0"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridSize === "large" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("large")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posters Grid */}
      <div className="container mx-auto px-4 py-8">
        {currentPosters.length === 0 ? (
          <div className="text-center py-16">
            <Film className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No movie posters found</h3>
            <p className="text-gray-600 mb-6">We're working on adding more movie posters to our collection.</p>
            <Link href="/shop">
              <Button>Browse All Posters</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${getGridClasses()}`}>
              {currentPosters.map((poster) => (
                <PosterCard
                  key={poster.id}
                  id={poster.id}
                  title={poster.title}
                  price={poster.price}
                  priceA3={poster.priceA3}
                  category={poster.category}
                  imageUrl={poster.imageUrl}
                  description={poster.description}
                  slug={poster.slug}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
