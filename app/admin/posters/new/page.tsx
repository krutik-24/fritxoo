"use client"
import PosterForm from "@/components/admin/poster-form"

export default function NewPosterPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Poster</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <PosterForm mode="create" />
      </div>
    </div>
  )
}
