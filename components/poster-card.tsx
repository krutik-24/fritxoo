"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/context/cart-context"
import { useAnalytics } from "@/context/analytics-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"

interface PosterCardProps {
  id: string
  title: string
  price: number
  priceA3?: number
  category: string
  imageUrl: string
  description?: string
  slug?: string
}

export default function PosterCard({
  id,
  title,
  price,
  priceA3 = 149,
  category,
  imageUrl,
  description,
  slug,
}: PosterCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedSize, setSelectedSize] = useState<"A4" | "A3">("A4")
  const [retryCount, setRetryCount] = useState(0)
  const { addItem } = useCart()
  const { trackView, trackClick } = useAnalytics()
  const { toast } = useToast()
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Set correct pricing based on category
  const basePrice = category === "Split Posters" ? 299 : 99
  const a3Price = category === "Split Posters" ? 399 : 149

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Track view when component becomes visible
  useEffect(() => {
    if (isVisible) {
      trackView(id, "gallery")
    }
  }, [id, trackView, isVisible])

  // Calculate current price based on selected size and poster type
  const currentPrice = useMemo(() => {
    // Special pricing for collage posters
    if (category === "Collage" || title.includes("Collage")) {
      return selectedSize === "A4" ? 699 : 999
    }

    // Regular pricing for other posters
    return selectedSize === "A4" ? basePrice : a3Price
  }, [selectedSize, basePrice, a3Price, category, title])

  // Enhanced image URL validation and optimization
  const getOptimizedImageUrl = useCallback((url: string, fallbackTitle: string) => {
    if (!url || url === "undefined" || url === "null") {
      return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(fallbackTitle)}`
    }

    // Handle blob URLs - only allow trusted sources
    if (url.startsWith("blob:")) {
      if (url.includes("v0.dev") || url.includes("vercel-storage.com")) {
        return url
      } else {
        console.warn(`Untrusted blob URL for ${fallbackTitle}: ${url}`)
        return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(fallbackTitle)}`
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
    return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(fallbackTitle)}`
  }, [])

  const optimizedImageUrl = getOptimizedImageUrl(imageUrl, title)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    trackClick(id, "add_to_cart")

    const itemPrice = selectedSize === "A4" ? basePrice : a3Price

    addItem({
      id: `${id}-${selectedSize}`,
      title: `${title} (${selectedSize})`,
      price: itemPrice,
      category,
      imageUrl: imageError
        ? `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(title)}`
        : optimizedImageUrl,
      size: selectedSize,
    })

    toast({
      title: "Added to cart",
      description: `${title} (${selectedSize}) has been added to your cart.`,
    })
  }

  const handleViewDetails = () => {
    trackClick(id, "view_details")
  }

  const handleImageError = useCallback(() => {
    console.warn(`Failed to load image for ${title}: ${imageUrl}`)

    // Try to retry loading a few times for network issues
    if (retryCount < 2 && !imageUrl.includes("placeholder.svg")) {
      setRetryCount((prev) => prev + 1)
      // Force reload by updating the src
      if (imageRef.current) {
        imageRef.current.src = optimizedImageUrl + `?retry=${retryCount + 1}`
      }
      return
    }

    setImageError(true)
    setImageLoaded(true)
  }, [title, imageUrl, optimizedImageUrl, retryCount])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    setImageError(false)
    setRetryCount(0)
  }, [])

  const productSlug = slug || id

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <Link href={`/products/${productSlug}`} onClick={handleViewDetails}>
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
          {isVisible && !imageError ? (
            <>
              <Image
                ref={imageRef}
                src={optimizedImageUrl || "/placeholder.svg"}
                alt={title}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                loading="lazy"
                quality={90}
                unoptimized={optimizedImageUrl.includes("blob") || optimizedImageUrl.startsWith("data:")}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                    <span className="text-xs text-gray-500">Loading image...</span>
                  </div>
                </div>
              )}
            </>
          ) : imageError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center p-4">
                <div className="flex items-center justify-center mb-2">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
                <div className="text-xs text-gray-500">{category}</div>
                <div className="text-xs text-gray-400 mt-2">Image unavailable</div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="text-xs">Preparing...</div>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1" title={title}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{category}</p>
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={description}>
            {description}
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">₹{currentPrice}</span>
              <span className="text-xs text-gray-500">{selectedSize} Size</span>
            </div>
            <Select value={selectedSize} onValueChange={(value: "A4" | "A3") => setSelectedSize(value)}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4 - ₹{basePrice}</SelectItem>
                <SelectItem value="A3">A3 - ₹{a3Price}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className="w-full h-8 text-xs bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
