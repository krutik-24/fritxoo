"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ImageIcon, Trash2, Plus, Eye, RefreshCw, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import ImageUploader from "./image-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

interface StoredImage {
  id: string
  url: string
  title: string
  description: string
  altText: string
  category: string
  uploadedAt: string
  filename: string
}

// Initial data with the provided image
const INITIAL_IMAGES: StoredImage[] = [
  {
    id: "1",
    url: "https://zrezcgohvq3ety2s.public.blob.vercel-storage.com/cars/ChatGPT%20Image%20May%2015%2C%202025%2C%2012_34_42%20PM-sPbZpWyoxWe8dXwRrFcZupI3NgZw55.png",
    title: "Sports Car",
    description: "High-performance sports car poster",
    altText: "Red sports car on display",
    category: "cars",
    uploadedAt: "2025-05-15",
    filename: "ChatGPT Image May 15, 2025, 12_34_42 PM.png",
  },
  {
    id: "2",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ferrari-zRRcRnTqxvH5OtVwTdzu5sXkXGS5TZ.png",
    title: "Ferrari 250 GTO",
    description: "1963 Ferrari 250 GTO classic sports car poster in deep red",
    altText: "1963 Ferrari 250 GTO poster with red car on burgundy background",
    category: "cars",
    uploadedAt: "2025-05-18",
    filename: "ferrari.png",
  },
]

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "general", label: "General" },
  { value: "cars", label: "Cars" },
  { value: "movies", label: "Movies" },
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "anime", label: "Anime" },
  { value: "gaming", label: "Gaming" },
  { value: "minimalist", label: "Minimalist" },
  { value: "typography", label: "Typography" },
]

export default function ImageManager() {
  const [images, setImages] = useState<StoredImage[]>(INITIAL_IMAGES)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Simulate loading images from an API or local storage
  useEffect(() => {
    // In a real application, you would fetch images from an API here
    const savedImages = localStorage.getItem("storedImages")
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages)
        // Merge with the initial images to ensure they're always present
        const mergedImages = [...INITIAL_IMAGES]

        // Add any saved images that aren't already in the initial set
        parsedImages.forEach((savedImage: StoredImage) => {
          if (!mergedImages.some((img) => img.url === savedImage.url)) {
            mergedImages.push(savedImage)
          }
        })

        setImages(mergedImages)
      } catch (error) {
        console.error("Error parsing saved images:", error)
      }
    }
  }, [])

  // Save images to local storage when they change
  useEffect(() => {
    localStorage.setItem("storedImages", JSON.stringify(images))
  }, [images])

  // Filter images based on search and category
  const filteredImages = images.filter(
    (image) =>
      (categoryFilter === "all" || image.category === categoryFilter) &&
      (image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.filename.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleUploadComplete = (imageData: {
    url: string
    title: string
    description: string
    altText: string
    category: string
    filename: string
  }) => {
    const newImage: StoredImage = {
      id: `img-${Date.now()}`,
      url: imageData.url,
      title: imageData.title,
      description: imageData.description,
      altText: imageData.altText,
      category: imageData.category,
      uploadedAt: new Date().toISOString().split("T")[0],
      filename: imageData.filename,
    }

    setImages([newImage, ...images])
    setShowUploadDialog(false)

    toast({
      title: "Image added",
      description: `The image has been added to the ${
        CATEGORIES.find((cat) => cat.value === imageData.category)?.label || imageData.category
      } category`,
    })
  }

  const handleDeleteImage = (id: string) => {
    // Don't allow deletion of the initial images
    if (id === "1" || id === "2") {
      toast({
        title: "Cannot delete",
        description: "This is a sample image and cannot be deleted",
        variant: "destructive",
      })
      return
    }

    if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      // In a real application, you would also delete from blob storage here
      setImages(images.filter((img) => img.id !== id))

      toast({
        title: "Image deleted",
        description: "The image has been deleted from your collection",
      })
    }
  }

  const simulateRefresh = () => {
    setIsLoading(true)

    // Simulate an API call delay
    setTimeout(() => {
      toast({
        title: "Gallery refreshed",
        description: "Image gallery has been refreshed",
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Image Gallery</h2>
          <Badge variant="outline" className="ml-2">
            {images.length} {images.length === 1 ? "image" : "images"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={simulateRefresh} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Image to Blob Storage</DialogTitle>
              </DialogHeader>
              <ImageUploader onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search images by title, description or filename..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{CATEGORIES.find((cat) => cat.value === categoryFilter)?.label || "Filter by Category"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No images found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery || categoryFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Upload some images to get started"}
          </p>
          {(searchQuery || categoryFilter !== "all") && (
            <div className="flex justify-center gap-2 mt-4">
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
              {categoryFilter !== "all" && (
                <Button variant="outline" onClick={() => setCategoryFilter("all")}>
                  Clear filter
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-[3/2] relative">
                <Image src={image.url || "/placeholder.svg"} alt={image.altText} fill className="object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate" title={image.title}>
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2" title={image.description}>
                    {image.description}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {image.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{image.uploadedAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedImage.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-[3/2] relative rounded-md overflow-hidden">
                <Image
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.altText}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Title</p>
                    <p>{selectedImage.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="capitalize">{selectedImage.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Upload Date</p>
                    <p>{selectedImage.uploadedAt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Filename</p>
                    <p className="text-xs truncate">{selectedImage.filename}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p>{selectedImage.description || "No description provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Alt Text</p>
                    <p>{selectedImage.altText || "No alt text provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">URL</p>
                    <p className="text-xs break-all">{selectedImage.url}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedImage.url)
                    toast({
                      title: "URL copied",
                      description: "Image URL has been copied to clipboard",
                    })
                  }}
                >
                  Copy URL
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteImage(selectedImage.id)
                    setSelectedImage(null)
                  }}
                  disabled={selectedImage.id === "1" || selectedImage.id === "2"} // Disable delete for the initial images
                >
                  Delete Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
