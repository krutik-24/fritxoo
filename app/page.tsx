"use client"

import HeroSection from "@/components/hero-section"
import Navbar from "@/components/navbar"
import PosterGallery from "@/components/poster-gallery"
import FeaturedCategories from "@/components/featured-categories"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"
import { usePosters } from "@/context/poster-context"

export default function Home() {
  const { getFeaturedPosters, loading } = usePosters()
  
  // Get featured posters
  const featuredPosters = getFeaturedPosters()

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <PosterGallery 
        title="Featured Posters" 
        subtitle="Discover our handpicked collection of stunning posters"
        posters={featuredPosters} 
        loading={loading}
      />
      <Testimonials />
      <Footer />
    </main>
  )
}
