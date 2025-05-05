"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

// Mock data for demonstration
const MOCK_POSTERS = [
  {
    id: "1",
    title: "Cyberpunk City",
    category: "Gaming",
    price: 199,
    description: "A futuristic cityscape with neon lights",
    // This would be a base64 string in a real application
    imageData: null,
  },
  {
    id: "2",
    title: "Sunset Beach",
    category: "Minimalist",
    price: 249,
    description: "Peaceful beach scene at sunset",
    imageData: null,
  },
]

export default function PostersAdminPage() {
  const [posters, setPosters] = useState(MOCK_POSTERS)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this poster?")) {
      setPosters(posters.filter((poster) => poster.id !== id))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Posters</h1>
        <Link href="/admin/posters/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Poster
          </Button>
        </Link>
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
              {posters.map((poster) => (
                <tr key={poster.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 bg-gray-100 rounded relative">
                      {poster.imageData ? (
                        <Image
                          src={`data:image/png;base64,${poster.imageData}`}
                          alt={poster.title}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{poster.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{poster.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Rs. {poster.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/admin/posters/edit/${poster.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
