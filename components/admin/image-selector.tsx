"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, ImageIcon } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

interface StoredImage {
  id: string
  url: string
  title: string
  description: string
  altText: string
  category: string
  uploadedAt: string
}

// Initial data with the provided images
const INITIAL_IMAGES: StoredImage[] = [
  {
    id: "1",
    url: "https://zrezcgohvq3ety2s.public.blob.vercel-storage.com/cars/ChatGPT%20Image%20May%2015%2C%202025%2C%2012_34_42%20PM-sPbZpWyoxWe8dXwRrFcZupI3NgZw55.png",
    title: "Sports Car",
    description: "High-performance sports car poster",
    altText: "Red sports car on display",
    category: "cars",
    uploadedAt: "2025-05-15",
  },
  {
    id: "2",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ferrari-zRRcRnTqxvH5OtVwTdzu5sXkXGS5TZ.png",
    title: "Ferrari 250 GTO",
    description: "1963 Ferrari 250 GTO classic sports car poster in deep red",
    altText: "1963 Ferrari 250 GTO poster with red car on burgundy background",
    category: "cars",
    uploadedAt: "2025-05-18",
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

interface ImageSelectorProps {
  onSelect: (image: { url: string; title: string; altText: string }) => void
  selectedImageUrl?: string
  buttonLabel?: string
  defaultCategory?: string
}

export default function ImageSelector({
  onSelect,
  selectedImageUrl,
  buttonLabel = "Select Image",
  defaultCategory = "all",
}: ImageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState<StoredImage[]>(INITIAL_IMAGES)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState(defaultCategory)
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(
    selectedImageUrl ? images.find((img) => img.url === selectedImageUrl) || null : null,
  )

  // Load saved images from local storage
  useEffect(() => {
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

        // If we have a selectedImageUrl, find and set the selected image
        if (selectedImageUrl) {
          const selected = mergedImages.find((img) => img.url === selectedImageUrl)
          if (selected) {
            setSelectedImage(selected)
          }
        }
      } catch (error) {
        console.error("Error parsing saved images:", error)
      }
    }
  }, [selectedImageUrl])

  // Filter images based on search and category
  const filteredImages = images.filter(
    (image) =>
      (categoryFilter === "all" || image.category === categoryFilter) &&
      (image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSelectImage = (image: StoredImage) => {
    setSelectedImage(image)
    onSelect({
      url: image.url,
      title: image.title,
      altText: image.altText,
    })
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      {selectedImage ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <div className="aspect-[3/2] relative">
            <Image
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.altText}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3 bg-white border-t border-gray-200">
            <h4 className="font-medium text-sm truncate">{selectedImage.title}</h4>
            <p className="text-xs text-gray-500 truncate">{selectedImage.description}</p>
          </div>
          <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => setOpen(true)}>
            Change
          </Button>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full h-32 flex flex-col gap-2">
              <ImageIcon className="h-8 w-8" />
              {buttonLabel}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search images..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full">
                      <span>
                        {CATEGORIES.find((cat) => cat.value === categoryFilter)?.label || "Filter by Category"}
                      </span>
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
                <div className="text-center py-8">
                  <ImageIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No images found matching your search</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`cursor-pointer rounded-md overflow-hidden border transition-all ${
                        selectedImage?.id === image.id
                          ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <div className="aspect-[3/2] relative">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.altText}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2 bg-white border-t border-gray-200">
                        <h4 className="font-medium text-sm truncate">{image.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"} available
                </p>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
