"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { usePosters } from "@/context/poster-context"
import { Edit, Trash, Plus, Search } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = [
  "All",
  "Movies",
  "TV Shows",
  "Music",
  "Sports",
  "Anime",
  "Gaming",
  "Minimalist",
  "Typography",
  "Cars",
]

export default function PostersAdminPage() {
  const { posters, updatePoster, deletePoster, loading } = usePosters()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [posterToDelete, setPosterToDelete] = useState<string | null>(null)

  // Filter posters based on search term and category
  const filteredPosters = posters.filter((poster) => {
    const matchesSearch =
      poster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poster.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || poster.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleDeleteClick = (posterId: string) => {
    setPosterToDelete(posterId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (posterToDelete) {
      deletePoster(posterToDelete)
      toast({
        title: "Poster deleted",
        description: "The poster has been deleted successfully",
      })
      setDeleteDialogOpen(false)
      setPosterToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading posters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Posters</h1>
          <p className="text-gray-600 mt-1">Total posters: {posters.length}</p>
        </div>
        <Link href="/admin/posters/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Poster
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search posters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
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

      {filteredPosters.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Image
            src="/placeholder.svg?height=120&width=120"
            alt="No posters"
            width={120}
            height={120}
            className="mx-auto mb-4 opacity-50"
          />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm || categoryFilter !== "All" ? "No posters match your search" : "No posters found"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || categoryFilter !== "All"
              ? "Try adjusting your search terms or filters"
              : "You haven't created any posters yet. Start by adding your first poster."}
          </p>
          {!searchTerm && categoryFilter === "All" && (
            <Link href="/admin/posters/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Poster
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosters.map((poster) => (
                <TableRow key={poster.id}>
                  <TableCell>
                    <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={poster.imageUrl || "/placeholder.svg?height=80&width=60"}
                        alt={poster.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{poster.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{poster.category}</span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">₹{poster.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/admin/posters/edit/${poster.id}`)}
                        title="Edit poster"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(poster.id)}
                        title="Delete poster"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this poster? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
