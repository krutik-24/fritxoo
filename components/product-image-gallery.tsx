"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Loader2, AlertCircle, ZoomIn } from "lucide-react"

interface ProductImageGalleryProps {
  imageUrl: string
  title: string
}

export default function ProductImageGallery({ imageUrl, title }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(imageUrl || "/placeholder.svg")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  // Enhanced image URL validation
  const getOptimizedImageUrl = useCallback((url: string, fallbackTitle: string) => {
    if (!url || url === "undefined" || url === "null") {
      return `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(fallbackTitle)}`
    }

    // Handle blob URLs - only allow trusted sources
    if (url.startsWith("blob:")) {
      if (url.includes("v0.dev") || url.includes("vercel-storage.com")) {
        return url
      } else {
        console.warn(`Untrusted blob URL for ${fallbackTitle}: ${url}`)
        return `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(fallbackTitle)}`
      }
    }

    // Handle relative paths
    if (url.startsWith("/images/") || url.startsWith("/placeholder.svg")) {
      return url
    }

    // Handle external URLs
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://")
    }

    if (url.startsWith("https://")) {
      return url
    }

    // Default fallback
    return `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(fallbackTitle)}`
  }, [])

  const optimizedImageUrl = getOptimizedImageUrl(selectedImage, title)

  // In a real app, you might have multiple images per product
  const images = imageUrl ? [imageUrl] : ["/placeholder.svg"]

  const handleImageError = useCallback(() => {
    console.warn(`Failed to load product image for ${title}: ${imageUrl}`)
    setImageError(true)
    setImageLoaded(true)
  }, [title, imageUrl])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    setImageError(false)
  }, [])

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
        {!imageError ? (
          <>
            <Image
              src={optimizedImageUrl || "/placeholder.svg"}
              alt={title || "Product image"}
              fill
              className={`object-contain transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isZoomed ? "scale-150" : "scale-100"} cursor-zoom-in`}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={95}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={() => setIsZoomed(!isZoomed)}
              unoptimized={optimizedImageUrl.includes("blob") || optimizedImageUrl.startsWith("data:")}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-500">Loading product image...</span>
                </div>
              </div>
            )}
            {imageLoaded && !imageError && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center p-6">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-600 mb-2">{title}</div>
              <div className="text-sm text-gray-500">Product image unavailable</div>
              <div className="text-xs text-gray-400 mt-2">Please contact support if this persists</div>
            </div>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              className={cn(
                "relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0",
                selectedImage === img ? "border-black" : "border-gray-200 hover:border-gray-300",
              )}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={getOptimizedImageUrl(img, `${title || "/placeholder.svg"} - Image ${index + 1}`)}
                alt={`${title || "Product"} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={img.includes("blob") || img.startsWith("data:")}
              />
            </button>
          ))}
        </div>
      )}

      {isZoomed && (
        <div className="text-center">
          <button onClick={() => setIsZoomed(false)} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Click image to zoom out
          </button>
        </div>
      )}
    </div>
  )
}
