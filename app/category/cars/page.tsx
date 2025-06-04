"use client"

import { useEffect, useState } from "react"
import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Car, Filter, Grid3X3, Grid2X2, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CarsPage() {
  const { posters, loading } = usePosters()
  const [sortOption, setSortOption] = useState("featured")
  const [gridSize, setGridSize] = useState("3")
  const [currentPage, setCurrentPage] = useState(1)
  const [carPosters, setCarPosters] = useState<any[]>([])
  const postersPerPage = 12

  useEffect(() => {
    if (!loading && posters) {
      console.log("Loading car posters...")
      console.log("All available posters:", posters.length)

      // Filter posters by Cars category
      let filtered = posters.filter((poster) => {
        if (!poster || !poster.category) return false

        const categoryMatch = poster.category.toLowerCase() === "cars"
        console.log(`Checking poster "${poster.title}": category=${poster.category}, match=${categoryMatch}`)

        return categoryMatch
      })

      console.log("Filtered car posters:", filtered.length)

      // Sort posters based on the selected option
      switch (sortOption) {
        case "price-low":
          filtered = filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filtered = filtered.sort((a, b) => b.price - a.price)
          break
        case "newest":
          filtered = filtered.sort((a, b) => Number(b.id) - Number(a.id))
          break
        case "name":
          filtered = filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
        default:
          // Featured - sort by ID for consistent ordering
          filtered = filtered.sort((a, b) => Number(a.id) - Number(b.id))
          break
      }

      console.log("Final sorted car posters:", filtered.length)
      setCarPosters(filtered)
    }
  }, [posters, loading, sortOption])

  // Pagination
  const totalPages = Math.ceil(carPosters.length / postersPerPage)
  const startIndex = (currentPage - 1) * postersPerPage
  const currentPosters = carPosters.slice(startIndex, startIndex + postersPerPage)

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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading car posters...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Car className="h-8 w-8 text-red-400 mr-3" />
              <Badge variant="secondary" className="bg-red-500 text-white font-semibold">
                AUTOMOTIVE COLLECTION
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Car Posters</h1>
            <p className="text-xl text-red-100 mb-6 max-w-2xl mx-auto">
              Stunning automotive designs featuring classic cars, supercars, and legendary vehicles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-lg">
                <span className="font-semibold text-red-300">A4: ₹99</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-red-300">A3: ₹149</span>
              </div>
              <Badge variant="outline" className="border-green-400 text-green-400">
                Free Shipping on Orders Above ₹499
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar - Fixed at top */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/shop">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Categories
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {carPosters.length} car poster{carPosters.length !== 1 ? "s" : ""} found
              </span>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
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
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {startIndex + 1}-{Math.min(startIndex + postersPerPage, carPosters.length)} of {carPosters.length}{" "}
              car posters
            </span>
          </div>
        </div>
      </section>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {currentPosters.length > 0 ? (
            <>
              <div
                className={`grid gap-6 ${
                  gridSize === "2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {currentPosters.map((poster) => (
                  <PosterCard
                    key={poster.id}
                    id={poster.id}
                    title={poster.title}
                    category={poster.category}
                    price={poster.price}
                    priceA3={poster.priceA3}
                    imageUrl={poster.imageUrl}
                    description={poster.description}
                    slug={poster.slug}
                  />
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
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Car className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No car posters found</h3>
              <p className="text-gray-500 mb-4">No car posters are currently available in this category.</p>
              <p className="text-gray-500 mb-6">
                Try adding some from the{" "}
                <Link href="/admin/posters" className="text-red-500 hover:underline">
                  admin panel
                </Link>
                .
              </p>
              <Link href="/shop">
                <Button variant="outline">Browse All Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Car Posters?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              High-quality automotive art featuring legendary vehicles, classic cars, and modern supercars.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automotive Excellence</h3>
              <p className="text-gray-600">
                Featuring iconic vehicles from legendary manufacturers and classic automotive designs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Badge className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                High-resolution printing on premium paper ensures vibrant colors and sharp automotive details.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick processing and shipping to get your automotive art on your walls faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
