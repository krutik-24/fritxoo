"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, ImageIcon, Check, Tag } from "lucide-react"
import Image from "next/image"

// Mock categories for demonstration
const CATEGORIES = ["All", "Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography"]

// Mock tags for demonstration
const AVAILABLE_TAGS = ["Featured", "New", "Popular", "Trending", "Bestseller", "Limited", "Sale", "Exclusive"]

interface ImageItem {
  id: string
  url: string
  name: string
  category: string
  tags: string[]
  dateUploaded: string
  size: string
}

// Mock data for demonstration
const MOCK_IMAGES: ImageItem[] = [
  {
    id: "1",
    url: "/placeholder.svg?height=600&width=400",
    name: "Movie Poster 1",
    category: "Movies",
    tags: ["Featured", "New"],
    dateUploaded: "2023-10-15",
    size: "1.2 MB",
  },
  {
    id: "2",
    url: "/placeholder.svg?height=600&width=400",
    name: "TV Show Poster",
    category: "TV Shows",
    tags: ["Popular"],
    dateUploaded: "2023-10-14",
    size: "0.8 MB",
  },
  {
    id: "3",
    url: "/placeholder.svg?height=600&width=400",
    name: "Music Album Cover",
    category: "Music",
    tags: ["Trending"],
    dateUploaded: "2023-10-13",
    size: "1.5 MB",
  },
  {
    id: "4",
    url: "/placeholder.svg?height=600&width=400",
    name: "Sports Poster",
    category: "Sports",
    tags: ["New"],
    dateUploaded: "2023-10-12",
    size: "1.1 MB",
  },
  {
    id: "5",
    url: "/placeholder.svg?height=600&width=400",
    name: "Anime Character",
    category: "Anime",
    tags: ["Featured"],
    dateUploaded: "2023-10-11",
    size: "0.9 MB",
  },
  {
    id: "6",
    url: "/placeholder.svg?height=600&width=400",
    name: "Game Poster",
    category: "Gaming",
    tags: ["Bestseller"],
    dateUploaded: "2023-10-10",
    size: "1.3 MB",
  },
]

interface ImageSelectorProps {
  onSelect: (image: ImageItem) => void
  selectedImageId?: string
  buttonLabel?: string
}

export default function ImageSelector({ onSelect, selectedImageId, buttonLabel = "Select Image" }: ImageSelectorProps) {
  const [images] = useState<ImageItem[]>(MOCK_IMAGES)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  // Find the currently selected image
  const selectedImage = selectedImageId ? images.find((img) => img.id === selectedImageId) : undefined

  // Filter images based on search, category, and tags
  const filteredImages = images.filter((image) => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || image.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => image.tags.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  // Handle image selection
  const handleSelectImage = (image: ImageItem) => {
    onSelect(image)
    setOpen(false)
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-auto flex flex-col items-center justify-center p-4 border-dashed">
          {selectedImage ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-32 h-48 mb-2">
                <Image
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <p className="text-sm font-medium">{selectedImage.name}</p>
              <p className="text-xs text-gray-500 mt-1">Click to change</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 mb-2 text-gray-400" />
              <span>{buttonLabel}</span>
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search images..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-500 mr-2 flex items-center">
            <Tag className="h-3 w-3 mr-1" /> Filter by tag:
          </span>
          {AVAILABLE_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No images found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`
                  relative cursor-pointer rounded-md overflow-hidden
                  ${selectedImageId === image.id ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-gray-200"}
                `}
                onClick={() => handleSelectImage(image)}
              >
                <div className="aspect-[2/3] bg-gray-100 relative">
                  <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                  {selectedImageId === image.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
