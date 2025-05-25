"use client"

import { useParams } from "next/navigation"
import PosterForm from "@/components/admin/poster-form"

export default function EditPosterPage() {
  const params = useParams()
  const posterId = params.id as string

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Poster</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <PosterForm mode="edit" posterId={posterId} />
      </div>
    </div>
  )
}
