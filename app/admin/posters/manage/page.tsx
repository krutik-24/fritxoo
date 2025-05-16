"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Save, ArrowLeft, Trash2, Edit, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

// Mock categories for demonstration
const CATEGORIES = ["Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography"]

// Mock sizes for demonstration
const SIZES = ["A4", "A3", "13×19 inches", "18×24 inches", "24×36 inches"]

interface GalleryImage {
  id: string
  url: string
  name: string
  category: string
  tags: string[]
}

interface Poster {
  id: string
  title: string
  description: string
  price: number
  category: string
  imageId: string
  imageUrl: string
  sizes: string[]
  featured: boolean
  dateCreated: string
}

// Mock images for selection
const MOCK_IMAGES: GalleryImage[] = [
  {
    id: "1",
    url: "/placeholder.svg?height=600&width=400",
    name: "Movie Poster 1",
    category: "Movies",
    tags: ["Featured", "New"],
  },
  {
    id: "2",
    url: "/placeholder.svg?height=600&width=400",
    name: "TV Show Poster",
    category: "TV Shows",
    tags: ["Popular"],
  },
  {
    id: "3",
    url: "/placeholder.svg?height=600&width=400",
    name: "Music Album Cover",
    category: "Music",
    tags: ["Trending"],
  },
  {
    id: "4",
    url: "/placeholder.svg?height=600&width=400",
    name: "Sports Poster",
    category: "Sports",
    tags: ["New"],
  },
  {
    id: "5",
    url: "/placeholder.svg?height=600&width=400",
    name: "Anime Character",
    category: "Anime",
    tags: ["Featured"],
  },
  {
    id: "6",
    url: "/placeholder.svg?height=600&width=400",
    name: "Game Poster",
    category: "Gaming",
    tags: ["Bestseller"],
  },
]

// Mock posters for demonstration
const MOCK_POSTERS: Poster[] = [
  {
    id: "1",
    title: "Cyberpunk City",
    description: "A futuristic cityscape with neon lights",
    price: 199,
    category: "Gaming",
    imageId: "6",
    imageUrl: "/placeholder.svg?height=600&width=400",
    sizes: ["A4", "A3"],
    featured: true,
    dateCreated: "2023-10-15",
  },
  {
    id: "2",
    title: "Sunset Beach",
    description: "Peaceful beach scene at sunset",
    price: 249,
    category: "Minimalist",
    imageId: "3",
    imageUrl: "/placeholder.svg?height=600&width=400",
    sizes: ["A4", "13×19 inches"],
    featured: false,
    dateCreated: "2023-10-14",
  },
]

export default function ManagePostersPage() {
  const [posters, setPosters] = useState<Poster[]>(MOCK_POSTERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null)
  const [images] = useState<GalleryImage[]>(MOCK_IMAGES)
  const { toast } = useToast()

  // New poster form state
  const [newPoster, setNewPoster] = useState<Omit<Poster, "id" | "dateCreated">>({
    title: "",
    description: "",
    price: 199,
    category: "",
    imageId: "",
    imageUrl: "",
    sizes: ["A4"],
    featured: false,
  })

  // Filter posters based on search and category
  const filteredPosters = posters.filter((poster) => {
    const matchesSearch = poster.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || poster.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Handle poster deletion
  const handleDeletePoster = (id: string) => {
    if (confirm("Are you sure you want to delete this poster? This action cannot be undone.")) {
      setPosters(posters.filter((poster) => poster.id !== id))
      toast({
        title: "Poster deleted",
        description: "The poster has been deleted successfully.",
      })
    }
  }

  // Handle poster edit
  const handleEditPoster = (poster: Poster) => {
    setEditingPoster({ ...poster })
    setShowAddDialog(true)
  }

  // Toggle size selection
  const toggleSize = (size: string) => {
    if (editingPoster) {
      const newSizes = editingPoster.sizes.includes(size)
        ? editingPoster.sizes.filter((s) => s !== size)
        : [...editingPoster.sizes, size]
      setEditingPoster({ ...editingPoster, sizes: newSizes })
    } else {
      const newSizes = newPoster.sizes.includes(size)
        ? newPoster.sizes.filter((s) => s !== size)
        : [...newPoster.sizes, size]
      setNewPoster({ ...newPoster, sizes: newSizes })
    }
  }

  // Select image for poster
  const selectImage = (image: GalleryImage) => {
    if (editingPoster) {
      setEditingPoster({
        ...editingPoster,
        imageId: image.id,
        imageUrl: image.url,
      })
    } else {
      setNewPoster({
        ...newPoster,
        imageId: image.id,
        imageUrl: image.url,
      })
    }
  }

  // Save poster
  const savePoster = () => {
    const posterToSave = editingPoster || newPoster

    if (!posterToSave.title || !posterToSave.category || !posterToSave.imageId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (title, category, and image).",
        variant: "destructive",
      })
      return
    }

    if (editingPoster) {
      // Update existing poster
      setPosters(posters.map((p) => (p.id === editingPoster.id ? { ...editingPoster } : p)))
      toast({
        title: "Poster updated",
        description: "The poster has been updated successfully.",
      })
    } else {
      // Add new poster
      const newId = `poster-${Date.now()}`
      setPosters([
        {
          ...newPoster,
          id: newId,
          dateCreated: new Date().toISOString().split("T")[0],
        },
        ...posters,
      ])
      toast({
        title: "Poster created",
        description: "The new poster has been created successfully.",
      })
    }

    // Reset form and close dialog
    setNewPoster({
      title: "",
      description: "",
      price: 199,
      category: "",
      imageId: "",
      imageUrl: "",
      sizes: ["A4"],
      featured: false,
    })
    setEditingPoster(null)
    setShowAddDialog(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/posters">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Manage Posters</h1>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Poster
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingPoster ? "Edit Poster" : "Add New Poster"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="poster-title">Poster Title</Label>
                  <Input
                    id="poster-title"
                    value={editingPoster?.title || newPoster.title}
                    onChange={(e) => {
                      if (editingPoster) {
                        setEditingPoster({ ...editingPoster, title: e.target.value })
                      } else {
                        setNewPoster({ ...newPoster, title: e.target.value })
                      }
                    }}
                    placeholder="Enter poster title"
                  />
                </div>

                <div>
                  <Label htmlFor="poster-description">Description</Label>
                  <Textarea
                    id="poster-description"
                    value={editingPoster?.description || newPoster.description}
                    onChange={(e) => {
                      if (editingPoster) {
                        setEditingPoster({ ...editingPoster, description: e.target.value })
                      } else {
                        setNewPoster({ ...newPoster, description: e.target.value })
                      }
                    }}
                    placeholder="Enter poster description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="poster-price">Price (Rs.)</Label>
                    <Input
                      id="poster-price"
                      type="number"
                      value={editingPoster?.price || newPoster.price}
                      onChange={(e) => {
                        const price = Number(e.target.value)
                        if (editingPoster) {
                          setEditingPoster({ ...editingPoster, price })
                        } else {
                          setNewPoster({ ...newPoster, price })
                        }
                      }}
                      min={99}
                      step={10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="poster-category">Category</Label>
                    <Select
                      value={editingPoster?.category || newPoster.category}
                      onValueChange={(value) => {
                        if (editingPoster) {
                          setEditingPoster({ ...editingPoster, category: value })
                        } else {
                          setNewPoster({ ...newPoster, category: value })
                        }
                      }}
                    >
                      <SelectTrigger id="poster-category">
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
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">Available Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={(editingPoster?.sizes || newPoster.sizes).includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                        {(editingPoster?.sizes || newPoster.sizes).includes(size) && <Check className="ml-1 h-3 w-3" />}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingPoster?.featured || newPoster.featured}
                    onChange={(e) => {
                      if (editingPoster) {
                        setEditingPoster({ ...editingPoster, featured: e.target.checked })
                      } else {
                        setNewPoster({ ...newPoster, featured: e.target.checked })
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Poster
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Select Image</Label>
                <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className={`
                          border rounded-md overflow-hidden cursor-pointer
                          ${
                            (editingPoster?.imageId || newPoster.imageId) === image.id
                              ? "ring-2 ring-primary"
                              : "hover:ring-1 hover:ring-gray-300"
                          }
                        `}
                        onClick={() => selectImage(image)}
                      >
                        <div className="aspect-[2/3] relative">
                          <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                          {(editingPoster?.imageId || newPoster.imageId) === image.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-medium truncate">{image.name}</p>
                          <p className="text-xs text-gray-500">{image.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPoster(null)
                  setShowAddDialog(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={savePoster}>
                <Save className="h-4 w-4 mr-2" />
                {editingPoster ? "Update Poster" : "Save Poster"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search posters..."
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
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6">
          {filteredPosters.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No posters found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Add some posters to get started"}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredPosters.map((poster) => (
                <Card key={poster.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-48 bg-gray-100 relative flex-shrink-0">
                        <Image
                          src={poster.imageUrl || "/placeholder.svg"}
                          alt={poster.title}
                          fill
                          className="object-cover"
                        />
                        {poster.featured && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{poster.title}</h3>
                            <p className="text-gray-500 mt-1">{poster.category}</p>
                          </div>
                          <div className="text-xl font-bold">Rs. {poster.price}</div>
                        </div>
                        <p className="text-gray-700 mt-4">{poster.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {poster.sizes.map((size) => (
                            <span
                              key={size}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                          <span className="text-sm text-gray-500">Created: {poster.dateCreated}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditPoster(poster)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeletePoster(poster.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
