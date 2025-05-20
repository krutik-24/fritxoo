"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Upload, X, AlertCircle, Check } from "lucide-react"

interface BlobImageUploaderProps {
  onUploadComplete: (imageData: {
    url: string
    title: string
    description: string
    altText: string
  }) => void
}

export default function BlobImageUploader({ onUploadComplete }: BlobImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [altText, setAltText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, WebP, and GIF are supported.")
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.")
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Set default title from filename
    const fileName = file.name.split(".")[0].replace(/[_-]/g, " ")
    setTitle(fileName)
    setAltText(fileName)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, WebP, and GIF are supported.")
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.")
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Set default title from filename
    const fileName = file.name.split(".")[0].replace(/[_-]/g, " ")
    setTitle(fileName)
    setAltText(fileName)
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreview(null)
    setTitle("")
    setDescription("")
    setAltText("")
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadToBlob = async () => {
    if (!selectedFile) return

    // Validate form
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Create a simulated progress indicator
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)

      // Create form data for the upload
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Upload to blob storage
      const response = await fetch(`/api/upload-blob?filename=${encodeURIComponent(selectedFile.name)}`, {
        method: "POST",
        body: selectedFile,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      setUploadProgress(100)

      const blob = await response.json()

      toast({
        title: "Upload successful",
        description: "Image has been uploaded to blob storage",
      })

      // Pass the uploaded image data back to the parent component
      onUploadComplete({
        url: blob.url,
        title,
        description,
        altText,
      })

      // Clear the form after successful upload
      clearSelection()
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload image")
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!preview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop your image here or click to browse</p>
              <p className="text-gray-400 text-sm mb-4">Supports JPG, PNG, WebP, GIF (Max 5MB)</p>
              <Button type="button" disabled={uploading}>
                Select Image
              </Button>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <div className="aspect-[3/2] bg-gray-100 rounded-md overflow-hidden relative">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={clearSelection}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                disabled={uploading}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description (optional)"
                disabled={uploading}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Enter alternative text for accessibility"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">Describe the image for screen readers and SEO</p>
            </div>

            {uploading && (
              <div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {uploadProgress < 100 ? `Uploading: ${Math.round(uploadProgress)}%` : "Processing..."}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={uploadToBlob} disabled={uploading || !selectedFile} className="flex items-center gap-2">
                {uploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Upload to Blob Storage
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
