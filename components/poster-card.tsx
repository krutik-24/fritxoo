"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useAnalytics } from "@/context/analytics-context"
import { useToast } from "@/hooks/use-toast"

interface PosterCardProps {
  id: string
  title: string
  price: number
  category: string
  imageUrl: string
  description?: string
}

export default function PosterCard({ id, title, price, category, imageUrl, description }: PosterCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem } = useCart()
  const { trackView, trackClick } = useAnalytics()
  const { toast } = useToast()

  // Track view when component mounts - using useEffect instead of useState
  useEffect(() => {
    trackView(id, "gallery")
  }, [id, trackView])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    trackClick(id, "add_to_cart")

    addItem({
      id,
      title,
      price,
      category,
      imageUrl,
    })

    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart.`,
    })
  }

  const handleViewDetails = () => {
    trackClick(id, "view_details")
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <Link href={`/products/${id}`} onClick={handleViewDetails}>
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-500 capitalize">{category}</p>
        </div>

        {description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">₹{price}</span>
          <Button onClick={handleAddToCart} size="sm" className="bg-black text-white hover:bg-gray-800">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
