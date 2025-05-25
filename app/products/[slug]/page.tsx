"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { usePosters } from "@/context/poster-context"
import { useAnalytics } from "@/context/analytics-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductImageGallery from "@/components/product-image-gallery"
import ProductActions from "@/components/product-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { posters, loading } = usePosters()
  const { trackView } = useAnalytics()
  const [poster, setPoster] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return

    if (!loading) {
      const foundPoster = posters.find((p) => p.slug === slug || p.id === slug)
      if (foundPoster) {
        setPoster(foundPoster)
        // Track view when poster is found
        trackView(foundPoster.id, "product_page")
      } else {
        setNotFound(true)
      }
    }
  }, [slug, posters, loading, trackView])

  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid Product URL</h1>
          <p className="mb-8">The product URL is invalid.</p>
          <Link href="/shop">
            <Button>Browse All Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading product...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
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

  if (!poster) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading product details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href={`/category/${poster.category.toLowerCase().replace(/\s+/g, "-")}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to {poster.category}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductImageGallery imageUrl={poster.imageUrl} title={poster.title} />
            <ProductActions
              id={poster.id}
              title={poster.title}
              price={poster.price}
              category={poster.category}
              description={poster.description}
              imageUrl={poster.imageUrl}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
