"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, ImageIcon, Trash2, Edit, Tag, X, Check, Plus, Grid, List, HelpCircle } from "lucide-react"
import ImageUploader, { type ImageFile } from "@/components/admin/image-uploader"
import AdminGuide from "@/components/admin/admin-guide"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Mock categories for demonstration
const CATEGORIES = ["Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography"]

// Mock tags for demonstration
const AVAILABLE_TAGS = ["Featured", "New", "Popular", "Trending", "Bestseller", "Limited", "Sale", "Exclusive"]

interface GalleryImage {
  id: string
  url: string
  name: string
  category: string
  tags: string[]
  dateUploaded: string
  size: string
}

// Mock data for demonstration
const MOCK_IMAGES: GalleryImage[] = [
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

export default function ImagesAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>(MOCK_IMAGES)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const { toast } = useToast()

  // Filter images based on search, category, and tags
  const filteredImages = images.filter((image) => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => image.tags.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  // Handle image deletion
  const handleDeleteImage = (id: string) => {
    if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      setImages(images.filter((image) => image.id !== id))
      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully.",
      })
    }
  }

  // Handle image edit
  const handleEditImage = (image: GalleryImage) => {
    setEditingImage({ ...image })
  }

  // Save edited image
  const saveEditedImage = () => {
    if (!editingImage) return

    setImages(images.map((img) => (img.id === editingImage.id ? editingImage : img)))
    setEditingImage(null)

    toast({
      title: "Image updated",
      description: "The image details have been updated successfully.",
    })
  }

  // Toggle tag for editing image
  const toggleEditTag = (tag: string) => {
    if (!editingImage) return

    const newTags = editingImage.tags.includes(tag)
      ? editingImage.tags.filter((t) => t !== tag)
      : [...editingImage.tags, tag]

    setEditingImage({ ...editingImage, tags: newTags })
  }

  // Toggle filter tag
  const toggleFilterTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Handle upload complete
  const handleUploadComplete = (uploadedFiles: ImageFile[]) => {
    const newImages: GalleryImage[] = uploadedFiles.map((file) => ({
      id: file.id,
      url: file.preview,
      name: file.name,
      category: file.category,
      tags: file.tags,
      dateUploaded: new Date().toISOString().split("T")[0],
      size: `${(file.file.size / (1024 * 1024)).toFixed(1)} MB`,
    }))

    setImages([...newImages, ...images])
    setShowUploadDialog(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Image Gallery</h1>
          <Button variant="ghost" size="icon" onClick={() => setShowGuide(!showGuide)}>
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Upload Images</DialogTitle>
            </DialogHeader>
            <ImageUploader onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>

      {showGuide && <AdminGuide />}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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

            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2 flex items-center">
              <Tag className="h-3 w-3 mr-1" /> Filter by tag:
            </span>
            {AVAILABLE_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilterTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500 mr-2 flex items-center">Active filters:</span>
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilterTag(tag)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setSelectedTags([])}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="p-6">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No images found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || selectedCategory !== "all" || selectedTags.length > 0
                  ? "Try adjusting your search or filters"
                  : "Upload some images to get started"}
              </p>
              {(searchQuery || selectedCategory !== "all" || selectedTags.length > 0) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedTags([])
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredImages.map((image) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-[2/3] bg-gray-100 rounded-md overflow-hidden relative">
                    <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditImage(image)}
                        >
                          <Edit className="h-4 w-4" />
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
                  <div className="mt-2">
                    <h3 className="font-medium text-sm truncate" title={image.name}>
                      {image.name}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{image.category}</span>
                      <span className="text-xs text-gray-500">{image.size}</span>
                    </div>
                    {image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {filteredImages.map((image) => (
                <div key={image.id} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md relative flex-shrink-0">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{image.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{image.category}</span>
                      <span>{image.dateUploaded}</span>
                      <span>{image.size}</span>
                    </div>
                    {image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {image.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditImage(image)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Image Dialog */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[2/3] bg-gray-100 rounded-md overflow-hidden relative">
                <Image
                  src={editingImage.url || "/placeholder.svg"}
                  alt={editingImage.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Name</label>
                  <Input
                    value={editingImage.name}
                    onChange={(e) => setEditingImage({ ...editingImage, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select
                    value={editingImage.category}
                    onValueChange={(value) => setEditingImage({ ...editingImage, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <Badge
                        key={tag}
                        variant={editingImage.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleEditTag(tag)}
                      >
                        {tag}
                        {editingImage.tags.includes(tag) && <Check className="ml-1 h-3 w-3" />}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Information</label>
                  <div className="text-sm text-gray-500">
                    <p>Size: {editingImage.size}</p>
                    <p>Uploaded: {editingImage.dateUploaded}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={saveEditedImage} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
