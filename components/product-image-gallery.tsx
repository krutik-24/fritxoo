"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
  imageUrl: string
  title: string
}

export default function ProductImageGallery({ imageUrl, title }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(imageUrl || "/placeholder.svg")

  // In a real app, you might have multiple images per product
  const images = imageUrl ? [imageUrl] : ["/placeholder.svg"]

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border">
        <Image
          src={selectedImage || "/placeholder.svg"}
          alt={title || "Product image"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              className={cn(
                "relative w-20 h-20 rounded-md overflow-hidden border-2",
                selectedImage === img ? "border-black" : "border-transparent",
              )}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${title || "Product"} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
