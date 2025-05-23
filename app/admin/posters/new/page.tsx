"use client"

import type React from "react"

import { useState } from "react"
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

const CATEGORIES = ["Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography", "Cars"]

export default function NewPosterPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState(199)
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to save the poster
      // For demo purposes, we'll simulate the save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Poster created",
        description: "The poster has been created successfully and will appear in its category.",
      })

      // Redirect to the posters management page
      router.push("/admin/posters")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create poster. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploadComplete = (imagePath: string) => {
    setImageUrl(imagePath)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Poster</h1>
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
              <PublicImageUploader onUploadComplete={handleImageUploadComplete} title={title} />
              {imageUrl && <p className="text-sm text-green-600">Image will be saved to: {imageUrl}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !title || !category || !imageUrl}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Creating Poster</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                "Create Poster"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
