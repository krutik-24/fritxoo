"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useState } from "react"

interface PosterCardProps {
  id: string
  title: string
  category: string
  price: number
  imageData?: string | null
  imageUrl?: string
  slug?: string
}

export default function PosterCard({ id, title, category, price, imageData, imageUrl, slug = id }: PosterCardProps) {
  const { addItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id,
      title,
      category,
      price,
      imageData,
      imageUrl,
      size: "A4", // Default size
    })
  }

  return (
    <Card
      className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-[2/3] relative">
            {imageData ? (
              <Image src={`data:image/png;base64,${imageData}`} alt={title} fill className="object-cover" />
            ) : imageUrl ? (
              <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
            ) : (
              <Image src="/placeholder.svg?height=600&width=400" alt={title} fill className="object-cover" />
            )}
          </div>
          <div
            className={`absolute inset-0 bg-black bg-opacity-30 transition-opacity flex flex-col items-center justify-center gap-2 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <Link href={`/products/${slug}`}>
              <Button className="bg-white text-black hover:bg-gray-200">Quick View</Button>
            </Link>
            <Button className="bg-black text-white hover:bg-gray-800" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-gray-600 mb-2">{category}</p>
          <p className="font-bold">Rs. {price}</p>
        </div>
      </CardContent>
    </Card>
  )
}
