"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/context/cart-context"

export default function AIPosterPage() {
  const [posterTitle, setPosterTitle] = useState("")
  const [posterSize, setPosterSize] = useState("A4")
  const [posterCategory, setPosterCategory] = useState("Movies")
  const [posterPrice, setPosterPrice] = useState(299)
  const [generatedImageData, setGeneratedImageData] = useState<string | null>(null)
  const { addItem } = useCart()

  const handleImageGenerated = (imageData: string) => {
    setGeneratedImageData(imageData)
  }

  const handleAddToCart = () => {
    if (!generatedImageData || !posterTitle) return

    addItem({
      id: `ai-poster-${Date.now()}`, // Generate a unique ID
      title: posterTitle,
      category: posterCategory,
      price: posterPrice,
      imageData: generatedImageData,
      size: posterSize,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Generate Your Posters with AI</h1>
          <p className="text-center mt-2 text-gray-300">
            Create unique, personalized posters using our AI image generation technology
          </p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side - Poster details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="poster-title">Poster Title</Label>
                    <Input
                      id="poster-title"
                      placeholder="Enter a title for your poster"
                      value={posterTitle}
                      onChange={(e) => setPosterTitle(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">The title will be used to generate your AI poster image</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-category">Category</Label>
                    <Select value={posterCategory} onValueChange={setPosterCategory}>
                      <SelectTrigger id="poster-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Movies">Movies</SelectItem>
                        <SelectItem value="TV Shows">TV Shows</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Anime">Anime</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Minimalist">Minimalist</SelectItem>
                        <SelectItem value="Typography">Typography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-size">Poster Size</Label>
                    <Tabs defaultValue="A4" value={posterSize} onValueChange={setPosterSize}>
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="A4">A4</TabsTrigger>
                        <TabsTrigger value="A3">A3</TabsTrigger>
                        <TabsTrigger value="13x19">13×19"</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-price">Price (Rs.)</Label>
                    <Select value={posterPrice.toString()} onValueChange={(value) => setPosterPrice(Number(value))}>
                      <SelectTrigger id="poster-price">
                        <SelectValue placeholder="Select price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="199">Rs. 199</SelectItem>
                        <SelectItem value="249">Rs. 249</SelectItem>
                        <SelectItem value="299">Rs. 299</SelectItem>
                        <SelectItem value="349">Rs. 349</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right side - Image generator */}
                <div className="space-y-4">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-4">AI Image Generation</p>
                    <button
                      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                      onClick={() => {
                        // Placeholder for AI generation
                        const mockImageData = "/placeholder.svg?height=400&width=300"
                        setGeneratedImageData(mockImageData)
                      }}
                    >
                      Generate Poster
                    </button>
                    {generatedImageData && (
                      <div className="mt-4">
                        <img
                          src={generatedImageData || "/placeholder.svg"}
                          alt="Generated poster"
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="font-bold text-2xl">Rs. {posterPrice}</p>
                    <p className="text-gray-500 text-sm">Free shipping on orders above Rs. 499</p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="bg-black text-white hover:bg-gray-800"
                      disabled={!generatedImageData || !posterTitle}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Enter Your Title</h3>
                <p className="text-gray-600">
                  Type in a title or description for your poster. Be specific to get the best results.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Generate Image</h3>
                <p className="text-gray-600">
                  Click the generate button and our AI will create a unique poster image based on your title.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Add to Cart</h3>
                <p className="text-gray-600">
                  Like what you see? Add your AI-generated poster to your cart and proceed to checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
