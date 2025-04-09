import HeroSection from "@/components/hero-section"
import Navbar from "@/components/navbar"
import PosterGallery from "@/components/poster-gallery"
import FeaturedCategories from "@/components/featured-categories"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <PosterGallery />
      <Testimonials />
      <Footer />
    </main>
  )
}
