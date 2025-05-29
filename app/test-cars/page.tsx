"use client"

import { usePosters } from "@/context/poster-context"
import Image from "next/image"

export default function TestCarsPage() {
  const { posters, loading, getPostersByCategory } = usePosters()

  if (loading) {
    return <div>Loading...</div>
  }

  const carPosters = getPostersByCategory("cars")
  const allPosters = posters.filter((p) => p.category === "Cars")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Car Posters Debug</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All Posters with Cars Category ({allPosters.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPosters.map((poster) => (
            <div key={poster.id} className="border p-4 rounded">
              <h3 className="font-medium">{poster.title}</h3>
              <p className="text-sm text-gray-600">Category: {poster.category}</p>
              <p className="text-sm text-gray-600">Image URL: {poster.imageUrl}</p>
              <div className="mt-2 aspect-[3/4] relative">
                <Image
                  src={poster.imageUrl || "/placeholder.svg"}
                  alt={poster.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Filtered Car Posters ({carPosters.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carPosters.map((poster) => (
            <div key={poster.id} className="border p-4 rounded">
              <h3 className="font-medium">{poster.title}</h3>
              <p className="text-sm text-gray-600">Category: {poster.category}</p>
              <p className="text-sm text-gray-600">Image URL: {poster.imageUrl}</p>
              <div className="mt-2 aspect-[3/4] relative">
                <Image
                  src={poster.imageUrl || "/placeholder.svg"}
                  alt={poster.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
