"use client"

import Link from "next/link"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import PosterCard from "./poster-card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Sample data - in a real app, this would come from your database
const CATEGORIES = ["Movies", "TV Shows", "Cars", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography"]

// Sample posters organized by category
const POSTERS_BY_CATEGORY = {
  Movies: [
    { id: "m1", title: "The Godfather", category: "Movies", price: 299, imageData: null },
    { id: "m2", title: "Pulp Fiction", category: "Movies", price: 249, imageData: null },
    { id: "m3", title: "Inception", category: "Movies", price: 199, imageData: null },
    { id: "m4", title: "The Dark Knight", category: "Movies", price: 279, imageData: null },
  ],
  "TV Shows": [
    { id: "tv1", title: "Breaking Bad", category: "TV Shows", price: 199, imageData: null },
    { id: "tv2", title: "Stranger Things", category: "TV Shows", price: 249, imageData: null },
    { id: "tv3", title: "The Walking Dead", category: "TV Shows", price: 199, imageData: null },
    { id: "tv4", title: "Game of Thrones", category: "TV Shows", price: 299, imageData: null },
  ],
  Cars: [
    { id: "c1", title: "Ferrari F40", category: "Cars", price: 249, imageData: null },
    { id: "c2", title: "Porsche 911", category: "Cars", price: 249, imageData: null },
    { id: "c3", title: "Lamborghini Countach", category: "Cars", price: 299, imageData: null },
    { id: "c4", title: "Aston Martin DB5", category: "Cars", price: 249, imageData: null },
  ],
  Music: [
    { id: "mu1", title: "Snoop Dogg", category: "Music", price: 199, imageData: null },
    { id: "mu2", title: "Pink Floyd", category: "Music", price: 249, imageData: null },
    { id: "mu3", title: "The Beatles", category: "Music", price: 279, imageData: null },
    { id: "mu4", title: "Queen", category: "Music", price: 249, imageData: null },
  ],
  Sports: [
    { id: "s1", title: "Porsche Racing", category: "Sports", price: 249, imageData: null },
    { id: "s2", title: "Basketball Legends", category: "Sports", price: 199, imageData: null },
    { id: "s3", title: "Football Stars", category: "Sports", price: 199, imageData: null },
    { id: "s4", title: "Cricket Champions", category: "Sports", price: 249, imageData: null },
  ],
  Anime: [
    { id: "a1", title: "Naruto", category: "Anime", price: 199, imageData: null },
    { id: "a2", title: "One Piece", category: "Anime", price: 199, imageData: null },
    { id: "a3", title: "Attack on Titan", category: "Anime", price: 249, imageData: null },
    { id: "a4", title: "My Hero Academia", category: "Anime", price: 199, imageData: null },
  ],
  Gaming: [
    { id: "g1", title: "Cyberpunk City", category: "Gaming", price: 199, imageData: null },
    { id: "g2", title: "The Last of Us", category: "Gaming", price: 249, imageData: null },
    { id: "g3", title: "God of War", category: "Gaming", price: 249, imageData: null },
    { id: "g4", title: "The Witcher", category: "Gaming", price: 199, imageData: null },
  ],
  Minimalist: [
    { id: "min1", title: "Sunset Beach", category: "Minimalist", price: 249, imageData: null },
    { id: "min2", title: "Mountain Silhouette", category: "Minimalist", price: 199, imageData: null },
    { id: "min3", title: "Abstract Shapes", category: "Minimalist", price: 199, imageData: null },
    { id: "min4", title: "Geometric Patterns", category: "Minimalist", price: 249, imageData: null },
  ],
  Typography: [
    { id: "t1", title: "Motivational Quotes", category: "Typography", price: 199, imageData: null },
    { id: "t2", title: "Vintage Typography", category: "Typography", price: 249, imageData: null },
    { id: "t3", title: "Modern Calligraphy", category: "Typography", price: 199, imageData: null },
    { id: "t4", title: "Bold Statements", category: "Typography", price: 199, imageData: null },
  ],
}

export default function ShopCategories() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<string>("all")

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const renderCategorySection = (category: string) => {
    const posters = POSTERS_BY_CATEGORY[category as keyof typeof POSTERS_BY_CATEGORY] || []
    const isExpanded = expandedCategories[category] || false
    const displayPosters = isExpanded ? posters : posters.slice(0, 4)

    return (
      <div key={category} className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{category}</h2>
          <Link href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayPosters.map((poster) => (
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

        {posters.length > 4 && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => toggleCategory(category)} className="flex items-center gap-2">
              {isExpanded ? "Show Less" : "Show More"}
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="flex flex-wrap justify-center">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-8">
          {CATEGORIES.map((category) => renderCategorySection(category))}
        </TabsContent>

        {CATEGORIES.map((category) => (
          <TabsContent key={category} value={category} className="mt-8">
            {renderCategorySection(category)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
