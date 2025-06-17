"use client"

import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"

export default function SplitPostersDebug() {
  const { posters, loading } = usePosters()

  // Filter split posters
  const splitPosters = posters.filter((poster) => poster.category === "Split Posters")

  console.log("All posters:", posters.length)
  console.log("Split posters:", splitPosters.length)
  console.log(
    "Split poster titles:",
    splitPosters.map((p) => p.title),
  )

  // Check for jersey poster specifically
  const jerseyPoster = splitPosters.find((poster) => poster.title.toLowerCase().includes("jersey"))

  console.log("Jersey poster found:", jerseyPoster)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading split posters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Split Posters Debug</h1>

        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
          <p>Total posters: {posters.length}</p>
          <p>Split posters: {splitPosters.length}</p>
          <p>Jersey poster found: {jerseyPoster ? "Yes" : "No"}</p>
          {jerseyPoster && (
            <div className="mt-2 p-2 bg-green-50 rounded">
              <p>
                <strong>Jersey Poster Details:</strong>
              </p>
              <p>Title: {jerseyPoster.title}</p>
              <p>Category: {jerseyPoster.category}</p>
              <p>Image URL: {jerseyPoster.imageUrl}</p>
              <p>Price: ₹{jerseyPoster.price}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {splitPosters.map((poster) => (
            <div key={poster.id} className="relative">
              <PosterCard
                id={poster.id}
                title={poster.title}
                category={poster.category}
                price={poster.price}
                priceA3={poster.priceA3}
                imageUrl={poster.imageUrl}
                description={poster.description}
                slug={poster.slug}
              />
              {poster.title.toLowerCase().includes("jersey") && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  JERSEY POSTER
                </div>
              )}
            </div>
          ))}
        </div>

        {splitPosters.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No split posters found</h3>
            <p className="text-gray-500">There might be an issue with the poster loading.</p>
          </div>
        )}
      </div>
    </div>
  )
}
