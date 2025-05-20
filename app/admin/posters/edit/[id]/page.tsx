"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import PublicImageUploader from "@/components/admin/public-image-uploader"
import { generateSlug } from "@/lib/file-utils"
import Image from "next/image"

const CATEGORIES = ["Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography", "Cars"]

// Mock data for demonstration
const MOCK_POSTERS = {
  "1": {
    id: "1",
    title: "Cyberpunk City",
    category: "Gaming",
    price: 199,
    description: "A futuristic cityscape with neon lights",
    imageUrl: "/images/cyberpunk-city.jpg",
    slug: "cyberpunk-city",
  },
  "2": {
    id: "2",
    title: "Sunset Beach",
    category: "Minimalist",
    price: 249,
    description: "Peaceful beach scene at sunset",
    imageUrl: "/images/sunset-beach.jpg",
    slug: "sunset-beach",
  },
  "3": {
    id: "3",
    title: "Ferrari 250 GTO",
    category: "Cars",
    price: 299,
    description: "Classic Ferrari 250 GTO sports car",
    imageUrl: "/images/ferrari-250-gto.png",
    slug: "ferrari-250-gto",
  },
}

export default function EditPosterPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState(199)
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [changeImage, setChangeImage] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would be an API call to get the poster
    // For demo purposes, we'll use the mock data
    const poster = MOCK_POSTERS[id as keyof typeof MOCK_POSTERS]

    if (poster) {
      setTitle(poster.title)
      setCategory(poster.category)
      setPrice(poster.price)
      setDescription(poster.description || "")
      setImageUrl(poster.imageUrl)
    }

    setIsLoading(false)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to update the poster
      // For demo purposes, we'll simulate the update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Poster updated",
        description: "The poster has been updated successfully and changes will be reflected in the shop.",
      })

      // Redirect to the posters management page
      router.push("/admin/posters")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update poster. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploadComplete = (imagePath: string) => {
    setImageUrl(imagePath)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading poster data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Poster</h1>
        <Button variant="outline" onClick={() => router.push("/admin/posters")}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poster Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Poster Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter poster title"
                  required
                />
                {title && <p className="text-xs text-gray-500">Slug: {generateSlug(title)}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={99}
                  step={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter poster description"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Poster Image</Label>

              {!changeImage ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-32 h-48">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Current image:</p>
                      <p className="text-xs text-gray-500 mb-4">{imageUrl}</p>
                      <Button type="button" size="sm" onClick={() => setChangeImage(true)}>
                        Change Image
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <PublicImageUploader onUploadComplete={handleImageUploadComplete} title={title} />
              )}

              {changeImage && imageUrl && <p className="text-sm text-green-600">Image will be saved to: {imageUrl}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !title || !category || !imageUrl}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Updating Poster</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                "Update Poster"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
