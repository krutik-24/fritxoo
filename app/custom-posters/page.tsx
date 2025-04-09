import CustomPoster from "@/components/custom-poster"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CustomPostersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-8 bg-black text-white text-center">
        <h1 className="text-3xl font-bold">Custom Posters</h1>
        <p className="mt-2">Create your own personalized poster design</p>
      </div>
      <CustomPoster />
      <Footer />
    </main>
  )
}
