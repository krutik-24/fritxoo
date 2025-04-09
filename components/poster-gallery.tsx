"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const POSTERS = [
  {
    id: 1,
    title: "John Wick",
    category: "Movies",
    price: 199,
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 2,
    title: "Blade Runner 2049",
    category: "Movies",
    price: 249,
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 3,
    title: "The Godfather",
    category: "Movies",
    price: 299,
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 4,
    title: "Breaking Bad",
    category: "TV Shows",
    price: 199,
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 5,
    title: "Stranger Things",
    category: "TV Shows",
    price: 249,
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 6,
    title: "The Walking Dead",
    category: "TV Shows",
    price: 199,
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 7,
    title: "Snoop Dogg",
    category: "Music",
    price: 199,
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 8,
    title: "Porsche Racing",
    category: "Sports",
    price: 249,
    image: "/placeholder.svg?height=600&width=400",
  },
]

export default function PosterGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSize, setSelectedSize] = useState(POSTER_SIZES[0])

  const filteredPosters =
    selectedCategory === "All" ? POSTERS : POSTERS.filter((poster) => poster.category === selectedCategory)

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
            <Card key={poster.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={poster.image || "/placeholder.svg"}
                    alt={poster.title}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover aspect-[2/3]"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                    <Button className="bg-white text-black hover:bg-gray-200">Quick View</Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{poster.title}</h3>
                  <p className="text-gray-600 mb-2">{poster.category}</p>
                  <p className="font-bold">Rs. {poster.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-bold">LOAD MORE</Button>
        </div>
      </div>
    </section>
  )
}
