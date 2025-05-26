"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/context/cart-context"
import { useAnalytics } from "@/context/analytics-context"
import { useToast } from "@/hooks/use-toast"

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
  priceA3,
  category,
  imageUrl,
  description,
  slug,
}: PosterCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [selectedSize, setSelectedSize] = useState<"A4" | "A3">("A4")
  const { addItem } = useCart()
  const { trackView, trackClick } = useAnalytics()
  const { toast } = useToast()

  // Track view when component mounts
  useEffect(() => {
    trackView(id, "gallery")
  }, [id, trackView])

  // Calculate current price based on selected size
  const currentPrice = selectedSize === "A4" ? price : priceA3 || 150

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    trackClick(id, "add_to_cart")

    addItem({
      id: `${id}-${selectedSize}`,
      title: `${title} (${selectedSize})`,
      price: currentPrice,
      category,
      imageUrl,
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

  const productSlug = slug || id

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <Link href={`/products/${productSlug}`} onClick={handleViewDetails}>
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.error(`Failed to load image: ${imageUrl}`)
              setImageLoaded(true)
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1" title={title}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{category}</p>
        </div>

        {description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>}

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
                <SelectItem value="A4">A4 - ₹{price}</SelectItem>
                <SelectItem value="A3">A3 - ₹{priceA3 || 150}</SelectItem>
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
