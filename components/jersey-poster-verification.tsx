"use client"

import { useState, useEffect } from "react"
import { usePosters } from "@/context/poster-context"
import Image from "next/image"
import { CheckCircle, XCircle, AlertTriangle, Monitor, Smartphone, Tablet } from "lucide-react"

export default function JerseyPosterVerification() {
  const { posters, loading, getPostersByCategory } = usePosters()
  const [verificationResults, setVerificationResults] = useState<any>({})
  const [imageLoadStatus, setImageLoadStatus] = useState<Record<string, boolean>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!loading) {
      runVerification()
    }
  }, [loading, posters])

  const runVerification = () => {
    console.log("🔍 Starting Jersey Poster Verification...")

    // Get all split posters
    const splitPosters = getPostersByCategory("split-posters")
    console.log("📊 Split Posters Found:", splitPosters.length)

    // Find jersey poster specifically
    const jerseyPoster = splitPosters.find(
      (poster) =>
        poster.title.toLowerCase().includes("jersey") ||
        poster.slug.includes("jersey") ||
        poster.description.toLowerCase().includes("jersey"),
    )

    console.log("🏈 Jersey Poster Found:", jerseyPoster)

    // Verification checks
    const results = {
      posterExists: !!jerseyPoster,
      correctCategory: jerseyPoster?.category === "Split Posters",
      hasValidImage: jerseyPoster?.imageUrl && jerseyPoster.imageUrl !== "",
      hasValidPrice: jerseyPoster?.price === 299,
      hasValidA3Price: jerseyPoster?.priceA3 === 399,
      isFeatured: jerseyPoster?.featured === true,
      hasDescription: jerseyPoster?.description && jerseyPoster.description.length > 0,
      hasSlug: jerseyPoster?.slug && jerseyPoster.slug !== "",
      posterData: jerseyPoster,
      allSplitPosters: splitPosters,
      totalPosters: posters.length,
    }

    setVerificationResults(results)
    console.log("✅ Verification Results:", results)
  }

  const handleImageLoad = (posterId: string) => {
    setImageLoadStatus((prev) => ({ ...prev, [posterId]: true }))
    console.log(`✅ Image loaded successfully for poster: ${posterId}`)
  }

  const handleImageError = (posterId: string, error: any) => {
    setImageErrors((prev) => ({ ...prev, [posterId]: error.toString() }))
    console.error(`❌ Image failed to load for poster: ${posterId}`, error)
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  const {
    posterExists,
    correctCategory,
    hasValidImage,
    hasValidPrice,
    hasValidA3Price,
    isFeatured,
    hasDescription,
    hasSlug,
    posterData,
    allSplitPosters,
  } = verificationResults

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">🏈 Jersey Poster Verification Report</h1>

        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className={`p-4 rounded-lg ${posterExists ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"} border`}
          >
            <div className="flex items-center gap-2">
              {posterExists ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <XCircle className="text-red-600" size={20} />
              )}
              <span className="font-semibold">Poster Exists</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{posterExists ? "Found" : "Not Found"}</p>
          </div>

          <div
            className={`p-4 rounded-lg ${correctCategory ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"} border`}
          >
            <div className="flex items-center gap-2">
              {correctCategory ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <XCircle className="text-red-600" size={20} />
              )}
              <span className="font-semibold">Correct Category</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{posterData?.category || "N/A"}</p>
          </div>

          <div
            className={`p-4 rounded-lg ${hasValidImage ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"} border`}
          >
            <div className="flex items-center gap-2">
              {hasValidImage ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <XCircle className="text-red-600" size={20} />
              )}
              <span className="font-semibold">Valid Image</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{hasValidImage ? "Present" : "Missing"}</p>
          </div>

          <div
            className={`p-4 rounded-lg ${hasValidPrice && hasValidA3Price ? "bg-green-100 border-green-200" : "bg-yellow-100 border-yellow-200"} border`}
          >
            <div className="flex items-center gap-2">
              {hasValidPrice && hasValidA3Price ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertTriangle className="text-yellow-600" size={20} />
              )}
              <span className="font-semibold">Pricing</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              A4: ₹{posterData?.price} | A3: ₹{posterData?.priceA3}
            </p>
          </div>
        </div>

        {/* Detailed Information */}
        {posterData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Jersey Poster Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>ID:</strong> {posterData.id}
                  </li>
                  <li>
                    <strong>Title:</strong> {posterData.title}
                  </li>
                  <li>
                    <strong>Category:</strong> {posterData.category}
                  </li>
                  <li>
                    <strong>Slug:</strong> {posterData.slug}
                  </li>
                  <li>
                    <strong>Featured:</strong> {posterData.featured ? "Yes" : "No"}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing & Technical</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>A4 Price:</strong> ₹{posterData.price}
                  </li>
                  <li>
                    <strong>A3 Price:</strong> ₹{posterData.priceA3}
                  </li>
                  <li>
                    <strong>Image URL:</strong> {posterData.imageUrl}
                  </li>
                  <li>
                    <strong>Description Length:</strong> {posterData.description?.length || 0} chars
                  </li>
                </ul>
              </div>
            </div>

            {posterData.description && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 bg-white p-3 rounded border">{posterData.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Image Loading Test */}
        {posterData && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Image Loading Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Desktop View */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor size={20} />
                  <span className="font-semibold">Desktop View</span>
                </div>
                <div className="aspect-[3/4] relative bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={posterData.imageUrl || "/placeholder.svg"}
                    alt={posterData.title}
                    fill
                    className="object-cover"
                    onLoad={() => handleImageLoad(`${posterData.id}-desktop`)}
                    onError={(e) => handleImageError(`${posterData.id}-desktop`, e)}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-2 text-sm">
                  Status:{" "}
                  {imageLoadStatus[`${posterData.id}-desktop`] ? (
                    <span className="text-green-600">✅ Loaded</span>
                  ) : imageErrors[`${posterData.id}-desktop`] ? (
                    <span className="text-red-600">❌ Error</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Loading</span>
                  )}
                </div>
              </div>

              {/* Tablet View */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tablet size={20} />
                  <span className="font-semibold">Tablet View</span>
                </div>
                <div className="aspect-[3/4] relative bg-gray-100 rounded overflow-hidden max-w-48 mx-auto">
                  <Image
                    src={posterData.imageUrl || "/placeholder.svg"}
                    alt={posterData.title}
                    fill
                    className="object-cover"
                    onLoad={() => handleImageLoad(`${posterData.id}-tablet`)}
                    onError={(e) => handleImageError(`${posterData.id}-tablet`, e)}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="mt-2 text-sm text-center">
                  Status:{" "}
                  {imageLoadStatus[`${posterData.id}-tablet`] ? (
                    <span className="text-green-600">✅ Loaded</span>
                  ) : imageErrors[`${posterData.id}-tablet`] ? (
                    <span className="text-red-600">❌ Error</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Loading</span>
                  )}
                </div>
              </div>

              {/* Mobile View */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone size={20} />
                  <span className="font-semibold">Mobile View</span>
                </div>
                <div className="aspect-[3/4] relative bg-gray-100 rounded overflow-hidden max-w-32 mx-auto">
                  <Image
                    src={posterData.imageUrl || "/placeholder.svg"}
                    alt={posterData.title}
                    fill
                    className="object-cover"
                    onLoad={() => handleImageLoad(`${posterData.id}-mobile`)}
                    onError={(e) => handleImageError(`${posterData.id}-mobile`, e)}
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                </div>
                <div className="mt-2 text-sm text-center">
                  Status:{" "}
                  {imageLoadStatus[`${posterData.id}-mobile`] ? (
                    <span className="text-green-600">✅ Loaded</span>
                  ) : imageErrors[`${posterData.id}-mobile`] ? (
                    <span className="text-red-600">❌ Error</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Loading</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Split Posters Overview */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">All Split Posters ({allSplitPosters?.length || 0})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSplitPosters?.map((poster: any) => (
              <div
                key={poster.id}
                className={`border rounded-lg p-3 ${poster.title.toLowerCase().includes("jersey") ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-20 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={poster.imageUrl || "/placeholder.svg"}
                      alt={poster.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate" title={poster.title}>
                      {poster.title}
                      {poster.title.toLowerCase().includes("jersey") && <span className="ml-2 text-blue-600">🏈</span>}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ₹{poster.price} / ₹{poster.priceA3}
                    </p>
                    <p className="text-xs text-gray-400">{poster.featured ? "Featured" : "Standard"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={runVerification}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Re-run Verification
          </button>
          <a
            href="/category/split-posters"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            🔗 View Split Posters Page
          </a>
          <button
            onClick={() => console.log("Verification Results:", verificationResults)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            📋 Log Results to Console
          </button>
        </div>
      </div>
    </div>
  )
}
