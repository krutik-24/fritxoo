"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Define poster type
interface Poster {
  id: string
  title: string
  category: string
  price: number
  description: string
  imageUrl: string
  slug?: string
}

// Mock data for demonstration
const MOCK_POSTERS: Poster[] = [
  {
    id: "1",
    title: "Cyberpunk City",
    category: "Gaming",
    price: 199,
    description: "A futuristic cityscape with neon lights",
    imageUrl: "/images/cyberpunk-city.jpg",
    slug: "cyberpunk-city",
  },
  {
    id: "2",
    title: "Sunset Beach",
    category: "Minimalist",
    price: 249,
    description: "Peaceful beach scene at sunset",
    imageUrl: "/images/sunset-beach.jpg",
    slug: "sunset-beach",
  },
  {
    id: "3",
    title: "Ferrari 250 GTO",
    category: "Cars",
    price: 299,
    description: "Classic Ferrari 250 GTO sports car",
    imageUrl: "/images/ferrari-250-gto.png",
    slug: "ferrari-250-gto",
  },
]

const CATEGORIES = ["Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography", "Cars"]

export default function PostersAdminPage() {
  const [posters, setPosters] = useState<Poster[]>(MOCK_POSTERS)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

  // New poster form state
  const [newPoster, setNewPoster] = useState<Omit<Poster, "id">>({
    title: "",
    category: "",
    price: 199,
    description: "",
    imageUrl: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Filter posters based on search term and category
  const filteredPosters = posters.filter((poster) => {
    const matchesSearch =
      poster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poster.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || poster.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  // Function to generate file path for saving
  const generateFilePath = (file: File, title: string) => {
    const extension = file.name.split(".").pop()
    const slug = generateSlug(title)
    return `/images/${slug}.${extension}`
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this poster?")) {
      setPosters(posters.filter((poster) => poster.id !== id))
      toast({
        title: "Poster deleted",
        description: "The poster has been deleted successfully.",
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPoster({
      ...newPoster,
      [name]: name === "price" ? Number(value) : value,
    })
  }

  const handleCategoryChange = (value: string) => {
    setNewPoster({
      ...newPoster,
      category: value,
    })
  }

  const handleAddPoster = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would upload the image to your server
      // For this example, we'll simulate saving to /public/images/
      let imageUrl = "/placeholder.svg?height=600&width=400"

      if (imageFile) {
        // Generate a path for the image in public/images
        imageUrl = generateFilePath(imageFile, newPoster.title)

        // In a real app, you would upload the file to the server here
        console.log(`Saving image to ${imageUrl}`)

        // For demo purposes, we'll use the preview URL
        if (imagePreview) {
          imageUrl = imagePreview
        }
      }

      // Generate a slug from the title
      const slug = generateSlug(newPoster.title)

      // Create new poster
      const newPosterWithId: Poster = {
        ...newPoster,
        id: Date.now().toString(),
        imageUrl,
        slug,
      }

      // Add to posters array
      setPosters([...posters, newPosterWithId])

      // Reset form
      setNewPoster({
        title: "",
        category: "",
        price: 199,
        description: "",
        imageUrl: "",
      })
      setImageFile(null)
      setImagePreview(null)
      setShowAddForm(false)

      toast({
        title: "Poster added",
        description: "The new poster has been added successfully and will appear in its category.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add poster. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (poster: Poster) => {
    setEditingPoster(poster)
    setShowEditDialog(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingPoster) {
      setEditingPoster({
        ...editingPoster,
        [name]: name === "price" ? Number(value) : value,
      })
    }
  }

  const handleEditCategoryChange = (value: string) => {
    if (editingPoster) {
      setEditingPoster({
        ...editingPoster,
        category: value,
      })
    }
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingPoster) {
      // Generate a path for the image in public/images
      const imageUrl = generateFilePath(file, editingPoster.title)

      // In a real app, you would upload the file to the server here
      console.log(`Saving image to ${imageUrl}`)

      // For demo purposes, we'll use a FileReader to get a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        if (editingPoster) {
          setEditingPoster({
            ...editingPoster,
            imageUrl: reader.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = () => {
    if (editingPoster) {
      // Update the slug if the title has changed
      const updatedPoster = {
        ...editingPoster,
        slug: generateSlug(editingPoster.title),
      }

      // Update the poster in the array
      setPosters(posters.map((p) => (p.id === updatedPoster.id ? updatedPoster : p)))

      setShowEditDialog(false)
      setEditingPoster(null)

      toast({
        title: "Poster updated",
        description: "The poster has been updated successfully and changes will be reflected in the shop.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Posters</h1>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? (
              "Cancel"
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add New Poster
              </>
            )}
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setPosters(MOCK_POSTERS)}>
            <RefreshCw className="h-4 w-4" />
            Reset Demo
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleAddPoster} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Poster Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newPoster.title}
                    onChange={handleInputChange}
                    placeholder="Enter poster title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newPoster.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category">
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

                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={newPoster.price}
                    onChange={handleInputChange}
                    min={99}
                    step={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newPoster.description}
                    onChange={handleInputChange}
                    placeholder="Enter poster description"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image">Poster Image</Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
                  <p className="text-xs text-gray-500 mt-1">
                    Image will be saved to public/images/ directory with a filename based on the poster title
                  </p>
                  {imagePreview && (
                    <div className="mt-2 relative w-40 h-60 mx-auto">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !newPoster.title || !newPoster.category || !imageFile}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Adding Poster</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  "Add Poster"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search posters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosters.length > 0 ? (
                filteredPosters.map((poster) => (
                  <tr key={poster.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-24 bg-gray-100 rounded relative">
                        <Image
                          src={poster.imageUrl || "/placeholder.svg"}
                          alt={poster.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{poster.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{poster.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{poster.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Rs. {poster.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleEdit(poster)}
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(poster.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No posters found. Try adjusting your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <h2 className="text-xl font-bold col-span-full">Poster Preview (As Shown in Shop)</h2>
        {filteredPosters.map((poster) => (
          <Card key={poster.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-[2/3] relative">
                  <Image src={poster.imageUrl || "/placeholder.svg"} alt={poster.title} fill className="object-cover" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{poster.title}</h3>
                <p className="text-gray-600 mb-2">{poster.category}</p>
                <p className="font-bold">Rs. {poster.price}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Poster Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Poster</DialogTitle>
            <DialogDescription>Make changes to the poster. Click save when you're done.</DialogDescription>
          </DialogHeader>

          {editingPoster && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editingPoster.title}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select value={editingPoster.category} onValueChange={handleEditCategoryChange}>
                  <SelectTrigger id="edit-category" className="col-span-3">
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

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={editingPoster.price}
                  onChange={handleEditInputChange}
                  min={99}
                  step={10}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editingPoster.description}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-image" className="text-right pt-2">
                  Image
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="relative w-32 h-48 mb-2">
                    <Image
                      src={editingPoster.imageUrl || "/placeholder.svg"}
                      alt={editingPoster.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <Input id="edit-image" type="file" accept="image/*" onChange={handleEditImageChange} />
                  <p className="text-xs text-gray-500">
                    Image will be saved to public/images/ directory with a filename based on the poster title
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
