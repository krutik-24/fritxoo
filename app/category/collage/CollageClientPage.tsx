"use client"

import { useEffect, useState } from "react"
import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CollageClientPage() {
  const { posters, loading } = usePosters()
  const [sortOption, setSortOption] = useState("featured")
  const [collagePosters, setCollagePosters] = useState<any[]>([])

  useEffect(() => {
    if (!loading) {
      console.log("Loading collage posters...")
      console.log("All available posters:", posters.length)

      // Filter posters by Collage category
      let filtered = posters.filter((poster) => {
        if (!poster || !poster.category) return false
        const categoryMatch = poster.category.toLowerCase() === "collage"
        console.log(`Checking poster "${poster.title}": category=${poster.category}, match=${categoryMatch}`)
        return categoryMatch
      })

      console.log("Filtered collage posters:", filtered.length)

      // Sort posters based on the selected option
      switch (sortOption) {
        case "price-low":
          filtered = filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filtered = filtered.sort((a, b) => b.price - a.price)
          break
        case "newest":
          filtered = filtered.sort((a, b) => Number(b.id.split("-")[1]) - Number(a.id.split("-")[1]))
          break
        default:
          // Featured - sort by featured status then by ID
          filtered = filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return Number(a.id.split("-")[1]) - Number(b.id.split("-")[1])
          })
          break
      }

      console.log("Final filtered and sorted collage posters:", filtered.length)
      setCollagePosters(filtered)
    }
  }, [posters, loading, sortOption])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading collage posters...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero section with brown and black gradient background */}
      <div className="bg-gradient-to-br from-amber-900 via-black to-amber-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Collage Posters</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Premium multi-character collections featuring your favorite characters in stunning arrangements
          </p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Link href="/shop">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Categories
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {collagePosters.length} poster{collagePosters.length !== 1 ? "s" : ""} found
              </span>
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {collagePosters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collagePosters.map((poster) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No collage posters found.</p>
              <p className="text-gray-500 mt-2">
                Try adding some from the{" "}
                <Link href="/admin/posters" className="text-blue-500 hover:underline">
                  admin panel
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
