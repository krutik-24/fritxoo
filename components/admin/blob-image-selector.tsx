"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, ImageIcon, Check } from "lucide-react"
import Image from "next/image"

interface BlobImage {
  id: string
  url: string
  title: string
  description: string
  altText: string
  uploadedAt: string
}

// Mock data for demonstration
const MOCK_IMAGES: BlobImage[] = [
  {
    id: "1",
    url: "/placeholder.svg?height=600&width=400",
    title: "Movie Poster 1",
    description: "A stunning movie poster for an upcoming film",
    altText: "Movie poster showing the main character",
    uploadedAt: "2023-10-15",
  },
  {
    id: "2",
    url: "/placeholder.svg?height=600&width=400",
    title: "TV Show Poster",
    description: "Official poster for the new TV series",
    altText: "TV show cast posing together",
    uploadedAt: "2023-10-14",
  },
  {
    id: "3",
    url: "/placeholder.svg?height=600&width=400",
    title: "Music Album Cover",
    description: "Album artwork for the latest release",
    altText: "Abstract album artwork with geometric shapes",
    uploadedAt: "2023-10-13",
  },
  {
    id: "4",
    url: "/placeholder.svg?height=600&width=400",
    title: "Sports Poster",
    description: "Promotional poster for the championship game",
    altText: "Athletes in action during a sports event",
    uploadedAt: "2023-10-12",
  },
]

interface BlobImageSelectorProps {
  onSelect: (image: BlobImage) => void
  selectedImageUrl?: string
  buttonLabel?: string
}

export default function BlobImageSelector({
  onSelect,
  selectedImageUrl,
  buttonLabel = "Select Image",
}: BlobImageSelectorProps) {
  const [images] = useState<BlobImage[]>(MOCK_IMAGES)
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)

  // Find the currently selected image
  const selectedImage = selectedImageUrl ? images.find((img) => img.url === selectedImageUrl) : undefined

  // Filter images based on search
  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle image selection
  const handleSelectImage = (image: BlobImage) => {
    onSelect(image)
    setOpen(false)
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
                  alt={selectedImage.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <p className="text-sm font-medium">{selectedImage.title}</p>
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
          <DialogTitle>Select an Image from Blob Storage</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search images by title or description..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No images found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or upload new images</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`
                  relative cursor-pointer rounded-md overflow-hidden
                  ${selectedImageUrl === image.url ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-gray-200"}
                `}
                onClick={() => handleSelectImage(image)}
              >
                <div className="aspect-[3/2] bg-gray-100 relative">
                  <Image src={image.url || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
                  {selectedImageUrl === image.url && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate" title={image.title}>
                    {image.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate" title={image.description}>
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
