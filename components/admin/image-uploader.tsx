"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Check, Upload, X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock categories for demonstration
const CATEGORIES = ["Movies", "TV Shows", "Music", "Sports", "Anime", "Gaming", "Minimalist", "Typography"]

// Mock tags for demonstration
const AVAILABLE_TAGS = ["Featured", "New", "Popular", "Trending", "Bestseller", "Limited", "Sale", "Exclusive"]

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export interface ImageFile {
  id: string
  file: File
  preview: string
  progress: number
  uploaded: boolean
  error?: string
  name: string
  category: string
  tags: string[]
}

interface ImageUploaderProps {
  onUploadComplete: (images: ImageFile[]) => void
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type not supported: ${file.name}. Please upload JPG, PNG, WebP, or GIF.`
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${file.name}. Maximum size is 5MB.`
    }

    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newErrors: string[] = []
    const validFiles: ImageFile[] = []

    Array.from(files).forEach((file) => {
      const error = validateFile(file)

      if (error) {
        newErrors.push(error)
      } else {
        validFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          uploaded: false,
          name: file.name.split(".")[0].replace(/[_-]/g, " "),
          category: "",
          tags: [],
        })
      }
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
    }

    if (validFiles.length > 0) {
      setSelectedFiles([...selectedFiles, ...validFiles])
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (id: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.id !== id))
  }

  const updateFileMetadata = (id: string, field: keyof ImageFile, value: any) => {
    setSelectedFiles(selectedFiles.map((file) => (file.id === id ? { ...file, [field]: value } : file)))
  }

  const toggleTag = (id: string, tag: string) => {
    const file = selectedFiles.find((f) => f.id === id)
    if (!file) return

    const newTags = file.tags.includes(tag) ? file.tags.filter((t) => t !== tag) : [...file.tags, tag]

    updateFileMetadata(id, "tags", newTags)
  }

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return

    // Validate files before upload
    const invalidFiles = selectedFiles.filter((file) => !file.name || !file.category)
    if (invalidFiles.length > 0) {
      toast({
        title: "Missing information",
        description: "Please provide a name and category for all images before uploading.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadComplete(false)
    setErrors([])

    // Simulate file upload with progress
    const uploadPromises = selectedFiles.map((file) => {
      return new Promise<void>((resolve) => {
        let progress = 0
        const interval = setInterval(
          () => {
            progress += Math.random() * 10
            if (progress >= 100) {
              progress = 100
              clearInterval(interval)

              // Mark file as uploaded
              updateFileMetadata(file.id, "progress", 100)
              updateFileMetadata(file.id, "uploaded", true)

              resolve()
            } else {
              updateFileMetadata(file.id, "progress", Math.floor(progress))
            }
          },
          300 + Math.random() * 500,
        ) // Randomize upload speed for demo
      })
    })

    await Promise.all(uploadPromises)

    setIsUploading(false)
    setUploadComplete(true)

    toast({
      title: "Upload complete",
      description: `Successfully uploaded ${selectedFiles.length} images.`,
    })

    onUploadComplete(selectedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newErrors: string[] = []
      const validFiles: ImageFile[] = []

      Array.from(e.dataTransfer.files).forEach((file) => {
        const error = validateFile(file)

        if (error) {
          newErrors.push(error)
        } else {
          validFiles.push({
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            name: file.name.split(".")[0].replace(/[_-]/g, " "),
            category: "",
            tags: [],
          })
        }
      })

      if (newErrors.length > 0) {
        setErrors(newErrors)
      }

      if (validFiles.length > 0) {
        setSelectedFiles([...selectedFiles, ...validFiles])
      }
    }
  }

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

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
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop your images here or click to browse</p>
            <p className="text-gray-400 text-sm mb-4">Supports JPG, PNG, WebP, GIF (Max 5MB per image)</p>
            <Button type="button" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Select Files"}
            </Button>
          </div>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Selected Images ({selectedFiles.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedFiles([])} disabled={isUploading}>
                Clear All
              </Button>
              <Button onClick={uploadFiles} disabled={isUploading || uploadComplete || selectedFiles.length === 0}>
                {isUploading ? "Uploading..." : uploadComplete ? "Uploaded" : "Upload All"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedFiles.map((file) => (
              <div key={file.id} className="border rounded-md p-4 relative">
                <button
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  onClick={() => removeFile(file.id)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-md relative flex-shrink-0">
                    <Image
                      src={file.preview || "/placeholder.svg"}
                      alt={file.name}
                      fill
                      className="object-cover rounded-md"
                    />
                    {file.uploaded && (
                      <div className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow space-y-3">
                    <div>
                      <Label htmlFor={`name-${file.id}`} className="text-xs text-gray-500">
                        Image Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`name-${file.id}`}
                        value={file.name}
                        onChange={(e) => updateFileMetadata(file.id, "name", e.target.value)}
                        className="h-8 text-sm"
                        disabled={isUploading || file.uploaded}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`category-${file.id}`} className="text-xs text-gray-500">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={file.category}
                        onValueChange={(value) => updateFileMetadata(file.id, "category", value)}
                        disabled={isUploading || file.uploaded}
                      >
                        <SelectTrigger id={`category-${file.id}`} className="h-8 text-sm">
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
                </div>

                <div className="mt-3">
                  <Label className="text-xs text-gray-500">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {AVAILABLE_TAGS.map((tag) => (
                      <Badge
                        key={tag}
                        variant={file.tags.includes(tag) ? "default" : "outline"}
                        className={`text-xs cursor-pointer ${isUploading || file.uploaded ? "opacity-60 pointer-events-none" : ""}`}
                        onClick={() => toggleTag(file.id, tag)}
                      >
                        {tag}
                        {file.tags.includes(tag) && <Check className="ml-1 h-3 w-3" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                {(isUploading || file.progress > 0) && (
                  <div className="mt-3">
                    <Progress value={file.progress} className="h-1" />
                    <p className="text-xs text-gray-500 mt-1">
                      {file.uploaded ? "Upload complete" : `Uploading: ${file.progress}%`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
