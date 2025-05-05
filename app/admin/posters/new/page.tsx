"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PosterForm, { type PosterData } from "@/components/poster-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPosterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (posterData: PosterData) => {
    setIsSubmitting(true)

    try {
      // In a real application, you would save this to your database
      // For now, we'll just simulate a successful save
      console.log("Poster data to save:", posterData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the admin dashboard or poster list
      router.push("/admin/posters")
    } catch (error) {
      console.error("Error saving poster:", error)
      alert("Failed to save poster. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create New Poster</h1>
          <Link href="/admin/posters">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Posters
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <PosterForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
