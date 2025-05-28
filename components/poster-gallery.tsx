"use client"

import { useState } from "react"
import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PosterGalleryProps {
  posters?: any[]
  title?: string
  subtitle?: string
  loading?: boolean
}

export default function PosterGallery({ 
  posters: propPosters, 
  title = "Featured Posters",
  subtitle = "Discover our collection of stunning automotive art",
  loading: propLoading 
}: PosterGalleryProps) {
  const { posters, loading: contextLoading } = usePosters()
  const [currentPage, setCurrentPage] = useState(1)
  const postersPerPage = 8

  // Use prop loading state if provided, otherwise use context loading
  const isLoading = propLoading !== undefined ? propLoading : contextLoading

  // Use propPosters if provided, otherwise use all posters from context
  const postersToDisplay = propPosters || posters

  // Calculate total pages
  const totalPages = Math.ceil(postersToDisplay.length / postersPerPage)

  // Get current posters
  const indexOfLastPoster = currentPage * postersPerPage
  const indexOfFirstPoster = indexOfLastPoster - postersPerPage
  const currentPosters = postersToDisplay.slice(indexOfFirstPoster, indexOfLastPoster)

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
            <p className="mt-2">Loading posters...</p>
          </div>
        </div>
      </section>
    )
  }

  if (postersToDisplay.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
          <div className="text-center py-12">
            <p className="text-gray-500">No posters available. Add some from the admin panel.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
          <p className="text-lg font-semibold text-green-600 mt-2">All posters only ₹99!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
