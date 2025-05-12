"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductImageGallery from "@/components/product-image-gallery"
import ProductActions from "@/components/product-actions"
import PromoBar from "@/components/promo-bar"

// Sample product data - in a real app, this would come from your database
const SAMPLE_PRODUCTS = {
  "unknown-3-piece-set": {
    id: "unknown-3-piece-set",
    title: "Unknown | 3 Piece Set",
    category: "Sets",
    price: 299,
    imageData: null,
  },
  "cyberpunk-city": {
    id: "cyberpunk-city",
    title: "Cyberpunk City",
    category: "Gaming",
    price: 99,
    imageData: null,
  },
  "sunset-beach": {
    id: "sunset-beach",
    title: "Sunset Beach",
    category: "Minimalist",
    price: 249,
    imageData: null,
  },
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the product data from your API
    // For demo purposes, we'll use the sample data
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const foundProduct = SAMPLE_PRODUCTS[slug as keyof typeof SAMPLE_PRODUCTS]
      setProduct(foundProduct || null)
      setLoading(false)
    }, 300)
  }, [slug])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <PromoBar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <ProductImageGallery />

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>

            <div className="flex items-center">
              <div className="flex items-center">
                <span className="mr-1">4.9/5</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="mx-2">-</span>
              <Link href="#reviews" className="text-sm text-gray-600 hover:underline">
                1000+ Reviews
              </Link>
              <Link href="#reviews" className="ml-2 text-sm text-yellow-500 hover:underline">
                See their experiences
              </Link>
            </div>

            <div className="border-t border-b py-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">Rs. {product.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-600">Taxes included.</span>
              </div>
              <Link href="/shipping" className="text-sm text-gray-600 hover:underline">
                Shipping
              </Link>
              <span className="text-sm text-gray-600"> calculated at checkout.</span>
            </div>

            <ProductActions product={product} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
