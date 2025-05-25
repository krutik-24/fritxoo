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

// Function to map category names to URL slugs
function getCategorySlug(categoryName: string): string {
  if (!categoryName) return ""

  const categoryMap: Record<string, string> = {
    Movies: "movies",
    "TV Shows": "tv-shows",
    Music: "music",
    Sports: "sports",
    Anime: "anime",
    Gaming: "gaming",
    Minimalist: "minimalist",
    Typography: "typography",
    Cars: "cars",
  }
  return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, "-")
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const category = slug ? CATEGORIES[slug as keyof typeof CATEGORIES] : null
  const { posters, loading } = usePosters()
  const [sortOption, setSortOption] = useState("featured")
  const [categoryPosters, setCategoryPosters] = useState<any[]>([])

  useEffect(() => {
    // If slug is undefined, redirect to shop page
    if (!slug) {
      router.push("/shop")
      return
    }

    if (!loading && slug) {
      // Get the category name from the slug
      const categoryName = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Filter posters by category
      let filtered = posters.filter((poster) => {
        if (!poster || !poster.category) return false
        const posterCategorySlug = getCategorySlug(poster.category)
        return posterCategorySlug === slug
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
          // Featured - no specific sorting
          break
      }

      setCategoryPosters(filtered)
    }
  }, [slug, posters, loading, sortOption, router])

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

  // If category doesn't exist, this would be handled better in a real app
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
                  imageUrl={poster.imageUrl}
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
