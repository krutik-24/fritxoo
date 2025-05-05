import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ShopCategories from "@/components/shop-categories"

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Shop All Posters</h1>
          <p className="text-center mt-2 text-gray-300">Browse our complete collection of high-quality posters</p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ShopCategories />
        </div>
      </main>

      <Footer />
    </div>
  )
}
