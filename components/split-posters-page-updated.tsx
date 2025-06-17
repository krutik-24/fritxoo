"use client"

import { usePosters } from "@/context/poster-context"
import PosterCard from "@/components/poster-card"
import { Skeleton } from "@/components/ui/skeleton"

export function SplitPostersPageUpdated() {
  const { getPostersByCategory, loading } = usePosters()
  const splitPosters = getPostersByCategory("Split Posters")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Split Posters Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium split-panel poster designs featuring dynamic layouts and striking visual compositions. Perfect for
            modern spaces that demand bold artistic statements.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Premium Collection</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Split Panel Design</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              {splitPosters.length} Posters Available
            </span>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Split Posters Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">₹299</div>
              <div className="text-sm text-gray-600">A4 Size</div>
              <div className="text-xs text-gray-500 mt-1">210 × 297 mm</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">₹399</div>
              <div className="text-sm text-gray-600">A3 Size</div>
              <div className="text-xs text-gray-500 mt-1">297 × 420 mm</div>
            </div>
          </div>
        </div>

        {/* Posters Grid */}
        {splitPosters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {splitPosters.map((poster) => (
              <div key={poster.id} className="group">
                <PosterCard
                  id={poster.id}
                  title={poster.title}
                  price={poster.price}
                  priceA3={poster.priceA3}
                  category={poster.category}
                  imageUrl={poster.imageUrl}
                  description={poster.description}
                  slug={poster.slug}
                />
                {poster.featured && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⭐ Featured
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Split Posters Available</h3>
            <p className="text-gray-500">Check back later for new split poster designs.</p>
          </div>
        )}

        {/* Category Features */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Split Posters?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dynamic Layout</h4>
              <p className="text-gray-600 text-sm">Split-panel designs create visual interest and modern appeal</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-gray-600 text-sm">High-resolution prints with exceptional detail and color accuracy</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Versatile Themes</h4>
              <p className="text-gray-600 text-sm">From sports inspiration to automotive excellence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
