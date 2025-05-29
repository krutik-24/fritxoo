"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Sample data for categories
const CATEGORIES = {
  movies: { name: "Movies", description: "Iconic movie posters for film enthusiasts" },
  "tv-shows": { name: "TV Shows", description: "Posters featuring your favorite television series" },
  music: { name: "Music", description: "Celebrate legendary musicians and bands" },
  sports: { name: "Sports", description: "Sports legends and memorable moments" },
  anime: { name: "Anime", description: "Japanese animation art and characters" },
  gaming: { name: "Gaming", description: "Video game art and characters" },
  minimalist: { name: "Minimalist", description: "Clean, simple designs with a modern aesthetic" },
  typography: { name: "Typography", description: "Beautiful text and lettering designs" },
  cars: { name: "Cars", description: "Stunning automotive designs and classic cars" },
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const category = slug ? CATEGORIES[slug as keyof typeof CATEGORIES] : null
  const { posters, loading, getPostersByCategory } = usePosters()
  const [sortOption, setSortOption] = useState("featured")
  const [categoryPosters, setCategoryPosters] = useState<any[]>([])

  useEffect(() => {
    // If slug is undefined, redirect to shop page
    if (!slug) {
      router.push("/shop")
      return
    }

    if (!loading && slug) {
      console.log("Loading category:", slug)
      console.log("All available posters:", posters)

      // Get posters by category using the context method
      let filtered = getPostersByCategory(slug)

      console.log("Filtered posters for category:", filtered)

      // Less restrictive filtering - only exclude obvious placeholders
      filtered = filtered.filter((poster) => {
        const hasValidImage =
          poster.imageUrl &&
          poster.imageUrl !== "/placeholder.svg" &&
          poster.imageUrl.trim() !== "" &&
          !poster.imageUrl.includes("placeholder")

        console.log(`Poster ${poster.title}: hasValidImage=${hasValidImage}, imageUrl=${poster.imageUrl}`)
        return hasValidImage
      })

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
        default:
          // Featured - sort by ID for consistent ordering
          filtered = filtered.sort((a, b) => Number(a.id) - Number(b.id))
          break
      }

      console.log("Final filtered and sorted posters:", filtered)
      setCategoryPosters(filtered)
    }
  }, [slug, posters, loading, sortOption, router, getPostersByCategory])

  // If slug is undefined, show loading state
  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // If category doesn't exist
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading posters...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">{category.name} Posters</h1>
          <p className="text-center mt-2 text-gray-300">{category.description}</p>
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
                {categoryPosters.length} poster{categoryPosters.length !== 1 ? "s" : ""} found
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

          {categoryPosters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryPosters.map((poster) => (
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
              <p className="text-gray-500">No posters found in this category.</p>
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
