"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageGenerator from "./image-generator"

interface PosterFormProps {
  onSubmit: (posterData: PosterData) => void
  initialData?: PosterData
}

export interface PosterData {
  title: string
  category: string
  price: number
  description: string
  imageData?: string
}

const CATEGORIES = ["Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography"]

export default function PosterForm({ onSubmit, initialData }: PosterFormProps) {
  const [formData, setFormData] = useState<PosterData>(
    initialData || {
      title: "",
      category: "",
      price: 199,
      description: "",
    },
  )

  const [imageData, setImageData] = useState<string | undefined>(initialData?.imageData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleImageGenerated = (generatedImageData: string) => {
    setImageData(generatedImageData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      imageData,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Poster Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter poster title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={handleCategoryChange}>
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
          value={formData.price}
          onChange={handleChange}
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
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter poster description"
          rows={4}
        />
      </div>

      <ImageGenerator title={formData.title} onImageGenerated={handleImageGenerated} />

      <Button type="submit" className="w-full" disabled={!formData.title || !formData.category || !imageData}>
        {initialData ? "Update Poster" : "Create Poster"}
      </Button>
    </form>
  )
}
