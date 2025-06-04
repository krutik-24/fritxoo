"use client"

import { usePosters } from "@/context/poster-context"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Car, Film, Layout } from "lucide-react"
import { useEffect, useState } from "react"

// Define the categories with their details
const categories = [
  {
    name: "Movies",
    slug: "movies",
    description: "Iconic movie posters for film enthusiasts",
    image: "/placeholder.svg?height=400&width=300",
    icon: Film,
  },
  {
    name: "TV Shows",
    slug: "tv-shows",
    description: "Posters featuring your favorite television series",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Music",
    slug: "music",
    description: "Celebrate legendary musicians and bands",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports legends and memorable moments",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Anime",
    slug: "anime",
    description: "Japanese animation art and characters",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Video game art and characters",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Minimalist",
    slug: "minimalist",
    description: "Clean, simple designs with a modern aesthetic",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Typography",
    slug: "typography",
    description: "Beautiful text and lettering designs",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Cars",
    slug: "cars",
    description: "Stunning automotive designs and classic cars",
    image: "/placeholder.svg?height=400&width=300",
    icon: Car,
  },
  {
    name: "Split Posters",
    slug: "split-posters",
    description: "Premium split-panel designs for modern aesthetics",
    image: "/placeholder.svg?height=400&width=300",
    icon: Layout,
  },
]

export default function ShopCategories() {
  const { posters, loading } = usePosters()
  const [posterCounts, setPosterCounts] = useState<Record<string, number>>({})
  const [categoriesWithPosters, setCategoriesWithPosters] = useState<typeof categories>([])

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
      "Split Posters": "split-posters",
    }
    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, "-")
  }

  useEffect(() => {
    if (!loading && posters) {
      // Count posters in each category
      const counts: Record<string, number> = {}

      posters.forEach((poster) => {
        if (poster && poster.category) {
          const slug = getCategorySlug(poster.category)
          counts[slug] = (counts[slug] || 0) + 1
        }
      })

      console.log("Category counts:", counts)
      setPosterCounts(counts)

      // Filter categories that have posters
      const withPosters = categories.filter((category) => counts[category.slug] > 0)
      console.log(
        "Categories with posters:",
        withPosters.map((c) => c.name),
      )
      setCategoriesWithPosters(withPosters)
    }
  }, [posters, loading])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
        <p className="mt-2">Loading categories...</p>
      </div>
    )
  }

  if (categoriesWithPosters.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Posters Available</h2>
        <p className="text-gray-500 mb-8">
          There are currently no posters available. Please check back later or add some from the admin panel.
        </p>
        <Link href="/admin/posters">
          <Button>Go to Admin Panel</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesWithPosters.map((category) => {
          // Find a poster in this category to use as the thumbnail
          const categoryPoster = posters.find(
            (poster) => poster && poster.category && getCategorySlug(poster.category) === category.slug,
          )
          const thumbnailImage = categoryPoster?.imageUrl || category.image

          // Determine the correct link path
          const linkPath = category.slug === "split-posters" ? "/split-posters" : `/category/${category.slug}`

          return (
            <Link key={category.slug} href={linkPath}>
              <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={thumbnailImage || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{posterCounts[category.slug] || 0} posters</span>
                    <Button variant="link" className="flex items-center p-0 h-auto text-blue-600 hover:text-blue-800">
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
