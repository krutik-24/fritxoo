"use client"

import { useState } from "react"
import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnimePage() {
  const { getPostersByCategory, loading } = usePosters()
  const [sortOption, setSortOption] = useState("featured")

  const animePosters = getPostersByCategory("Anime")

  // Sort posters based on selected option
  const sortedPosters = [...animePosters].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.price - b.price
    } else if (sortOption === "price-desc") {
      return b.price - a.price
    } else if (sortOption === "newest") {
      return Number.parseInt(b.id.split("-")[1]) - Number.parseInt(a.id.split("-")[1])
    } else {
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Anime Posters</h1>
          <p className="text-gray-600">
            Exclusive collection of Anime posters
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      ) : sortedPosters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedPosters.map((poster) => (
            <PosterCard key={poster.id} poster={poster} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900">No posters found</h3>
          <p className="mt-2 text-gray-500">We couldn't find any anime posters. Please check back later.</p>
        </div>
      )}
    </div>
  )
}
