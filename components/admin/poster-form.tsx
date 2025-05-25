"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import PublicImageUploader from "@/components/admin/public-image-uploader"
import { usePosters } from "@/context/poster-context"
import Image from "next/image"

interface PosterFormProps {
  posterId?: string
  mode: "create" | "edit"
}

export default function PosterForm({ posterId, mode }: PosterFormProps) {
  const { posters, addPoster, updatePoster, getPosterById } = usePosters()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load poster data if in edit mode
  useEffect(() => {
    if (mode === "edit" && posterId) {
      const poster = getPosterById(posterId)
      if (poster) {
        setTitle(poster.title)
        setDescription(poster.description || "")
        setPrice(poster.price.toString())
        setCategory(poster.category)
        setImageUrl(poster.imageUrl)
      }
    }
  }, [mode, posterId, getPosterById])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!title || !price || !category || !imageUrl) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const posterData = {
        title,
        description,
        price: Number.parseFloat(price),
        category,
        imageUrl,
      }

      if (mode === "create") {
        // Add new poster
        addPoster(posterData)
        toast({
          title: "Poster created",
          description: "Your poster has been created successfully",
        })
        router.push("/admin/posters")
      } else if (mode === "edit" && posterId) {
        // Update existing poster
        updatePoster(posterId, posterData)
        toast({
          title: "Poster updated",
          description: "Your poster has been updated successfully",
        })
        router.push("/admin/posters")
      }
    } catch (error) {
      console.error("Error saving poster:", error)
      toast({
        title: "Error",
        description: "Failed to save poster. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploadComplete = (path: string) => {
    setImageUrl(path)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter poster title"
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

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
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
                <SelectItem value="Cars">Cars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Poster Image</Label>
            {imageUrl ? (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={title || "Poster preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500 truncate flex-1">{imageUrl.split("/").pop()}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl("")}>
                      Change Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <PublicImageUploader onUploadComplete={handleImageUploadComplete} title={title} />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/posters")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2">{mode === "create" ? "Creating..." : "Updating..."}</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : mode === "create" ? (
            "Create Poster"
          ) : (
            "Update Poster"
          )}
        </Button>
      </div>
    </form>
  )
}
