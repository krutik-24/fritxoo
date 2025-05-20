import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PosterCard from "@/components/poster-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Sample car posters data
const CAR_POSTERS = [
  { id: "c1", title: "Ferrari F40", category: "Cars", price: 249, imageData: null },
  { id: "c2", title: "Porsche 911", category: "Cars", price: 249, imageData: null },
  { id: "c3", title: "Lamborghini Countach", category: "Cars", price: 299, imageData: null },
  { id: "c4", title: "Aston Martin DB5", category: "Cars", price: 249, imageData: null },
  { id: "c5", title: "Skyline GT-R under Cherry Blossoms", category: "Cars", price: 199, imageData: "https://zrezcgohvq3ety2s.public.blob.vercel-storage.com/cars/ChatGPT%20Image%20May%2015%2C%202025%2C%2012_34_42%20PM-sPbZpWyoxWe8dXwRrFcZupI3NgZw55.png" },
  { id: "c6", title: "BMW M3", category: "Cars", price: 199, imageData: null },
  { id: "c7", title: "Mercedes-Benz 300SL", category: "Cars", price: 299, imageData: null },
  { id: "c8", title: "Bugatti Chiron", category: "Cars", price: 249, imageData: null },
]

export default function CarsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Car Posters</h1>
          <p className="text-center mt-2 text-gray-300">
            Stunning posters featuring iconic and exotic cars for automotive enthusiasts
          </p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Link href="/shop">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Categories
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {CAR_POSTERS.map((poster) => (
              <PosterCard
                key={poster.id}
                id={poster.id}
                title={poster.title}
                category={poster.category}
                price={poster.price}
                imageData={poster.imageData}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
