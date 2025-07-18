"use client"

import { useState, useMemo } from "react"
import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid3X3, Grid2X2, ChevronLeft, ChevronRight, Car } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CarsPage() {
  const { posters, loading } = usePosters()
  const [sortBy, setSortBy] = useState("featured")
  const [gridSize, setGridSize] = useState("3")
  const [currentPage, setCurrentPage] = useState(1)
  const postersPerPage = 12

  // Filter car posters
  const carPosters = useMemo(() => {
    return posters.filter((poster) => poster.category === "Cars")
  }, [posters])

  // Apply sort
  const sortedPosters = useMemo(() => {
    let sorted = [...carPosters]

    // Sort posters
    switch (sortBy) {
      case "featured":
        sorted = sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
        break
      case "price-low":
        sorted = sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted = sorted.sort((a, b) => b.price - a.price)
        break
      case "name":
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return sorted
  }, [carPosters, sortBy])

  // Pagination
  const totalPages = Math.ceil(sortedPosters.length / postersPerPage)
  const startIndex = (currentPage - 1) * postersPerPage
  const currentPosters = sortedPosters.slice(startIndex, startIndex + postersPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading car posters...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-900 via-red-800 to-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Car className="h-6 w-6 text-red-400 mr-2" />
            <Badge variant="secondary" className="bg-red-400 text-black font-semibold">
              AUTOMOTIVE COLLECTION
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Car Posters</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover our exclusive collection of automotive posters featuring iconic cars and legendary models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-lg">
              <span className="font-semibold text-red-400">A4: ₹99</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-red-400">A3: ₹149</span>
            </div>
            <Badge variant="outline" className="border-green-400 text-green-400">
              Free Shipping on prepaid orders
            </Badge>
          </div>
        </div>
      </section>

      {/* Controls - Fixed position with no hover effect */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Title and Count */}
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Car Posters</h2>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {sortedPosters.length} designs
              </Badge>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Grid Size */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={gridSize === "2" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("2")}
                  className="h-8 w-8 p-0"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridSize === "3" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("3")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {startIndex + 1}-{Math.min(startIndex + postersPerPage, sortedPosters.length)} of{" "}
              {sortedPosters.length} car posters
            </span>
          </div>
        </div>
      </section>

      {/* Posters Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {currentPosters.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Car className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No car posters found</h3>
              <p className="text-gray-500">No car posters available at the moment.</p>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  gridSize === "2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {currentPosters.map((poster) => (
                  <div key={poster.id} className="group">
                    <PosterCard
                      id={poster.id}
                      title={poster.title}
                      category={poster.category}
                      price={poster.price}
                      priceA3={poster.priceA3}
                      imageUrl={poster.imageUrl}
                      description={poster.description}
                      slug={poster.slug}
                    />
                    {poster.featured && (
                      <div className="mt-2 flex justify-center">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <Car className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentPage(page)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Car Posters?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our automotive posters feature iconic cars and legendary models that will bring style and passion to any
              space.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Iconic Models</h3>
              <p className="text-gray-600">
                Featuring legendary cars that have made automotive history and captured enthusiasts' hearts.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Badge className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                High-resolution printing on premium paper ensures vibrant colors and sharp details.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Gift</h3>
              <p className="text-gray-600">
                Ideal gift for car enthusiasts, collectors, and anyone who appreciates automotive excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
