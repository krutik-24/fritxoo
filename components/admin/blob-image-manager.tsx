"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ImageIcon, Trash2, Plus, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import BlobImageUploader from "./blob-image-uploader"

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
]

export default function BlobImageManager() {
  const [images, setImages] = useState<BlobImage[]>(MOCK_IMAGES)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<BlobImage | null>(null)
  const { toast } = useToast()

  // Filter images based on search
  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUploadComplete = (imageData: {
    url: string
    title: string
    description: string
    altText: string
  }) => {
    const newImage: BlobImage = {
      id: `blob-${Date.now()}`,
      url: imageData.url,
      title: imageData.title,
      description: imageData.description,
      altText: imageData.altText,
      uploadedAt: new Date().toISOString().split("T")[0],
    }

    setImages([newImage, ...images])
    setShowUploadDialog(false)

    toast({
      title: "Image added",
      description: "The image has been added to your collection",
    })
  }

  const handleDeleteImage = (id: string) => {
    if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      // In a real application, you would also delete from blob storage here
      setImages(images.filter((img) => img.id !== id))

      toast({
        title: "Image deleted",
        description: "The image has been deleted from your collection",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blob Storage Images</h2>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Upload New Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Image to Blob Storage</DialogTitle>
            </DialogHeader>
            <BlobImageUploader onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search images by title or description..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No images found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery ? "Try adjusting your search" : "Upload some images to get started"}
          </p>
          {searchQuery && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
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
                  <Badge variant="outline" className="text-xs">
                    Blob Storage
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
                    <p className="text-sm font-medium text-gray-500">Upload Date</p>
                    <p>{selectedImage.uploadedAt}</p>
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
