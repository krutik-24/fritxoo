"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PosterCard from "./poster-card"

// Updated to include imageData
const POSTERS = [
  {
    id: "1",
    title: "Cyberpunk City",
    category: "Gaming",
    price: 199,
    imageData: null,
  },
  {
    id: "2",
    title: "Sunset Beach",
    category: "Minimalist",
    price: 249,
    imageData: null,
  },
  {
    id: "3",
    title: "The Godfather",
    category: "Movies",
    price: 299,
    imageData: null,
  },
  {
    id: "4",
    title: "Breaking Bad",
    category: "TV Shows",
    price: 199,
    imageData: null,
  },
  {
    id: "5",
    title: "Stranger Things",
    category: "TV Shows",
    price: 249,
    imageData: null,
  },
  {
    id: "6",
    title: "The Walking Dead",
    category: "TV Shows",
    price: 199,
    imageData: null,
  },
  {
    id: "7",
    title: "Snoop Dogg",
    category: "Music",
    price: 199,
    imageData: null,
  },
  {
    id: "8",
    title: "Porsche Racing",
    category: "Sports",
    price: 249,
    imageData: null,
  },
]

const POSTER_CATEGORIES = [
  "All",
  "Movies",
  "TV Shows",
  "Music",
  "Sports",
  "Anime",
  "Gaming",
  "Minimalist",
  "Typography",
]

const POSTER_SIZES = ["12×18 inches", "16×24 inches", "18×24 inches", "24×36 inches", "Custom Size"]

export default function PosterGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSize, setSelectedSize] = useState(POSTER_SIZES[0])
  const [posters, setPosters] = useState(POSTERS)
  const [isLoading, setIsLoading] = useState(false)

  const filteredPosters =
    selectedCategory === "All" ? posters : posters.filter((poster) => poster.category === selectedCategory)

  // This would be replaced with actual API calls in a real application
  const generateImagesForPosters = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would fetch from your API
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate having generated images for all posters
      setPosters((prev) =>
        prev.map((poster) => ({
          ...poster,
          // In a real app, this would be actual image data from your API
          imageData: null,
        })),
      )
    } catch (error) {
      console.error("Error generating images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Best Selling Posters</h2>

        <div className="flex flex-col md:flex-row justify-between mb-8">
          <Tabs defaultValue="All" className="w-full md:w-auto mb-4 md:mb-0">
            <TabsList className="grid grid-cols-3 md:grid-cols-9 h-auto">
              {POSTER_CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="w-full md:w-64">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {POSTER_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPosters.map((poster) => (
            <PosterCard
              key={poster.id}
              id={poster.id}
              title={poster.title}
              category={poster.category}
              price={poster.price}
              imageData={poster.imageData}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-bold">LOAD MORE</Button>
        </div>
      </div>
    </section>
  )
}
