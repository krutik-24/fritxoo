"use client"

import { useState } from "react"
import Image from "next/image"

const images = [
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
]

export default function ProductImageGallery() {
  const [mainImage, setMainImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[mainImage] || "/placeholder.svg"}
          alt="Unknown 3 Piece Set"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-square overflow-hidden rounded-md ${
              mainImage === index ? "ring-2 ring-black" : "ring-1 ring-gray-200"
            }`}
            onClick={() => setMainImage(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
