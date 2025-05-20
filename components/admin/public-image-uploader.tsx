"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateSlug } from "@/lib/file-utils"
import Image from "next/image"
import { Upload, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PublicImageUploaderProps {
  onUploadComplete: (imagePath: string) => void
  title?: string
}

export default function PublicImageUploader({ onUploadComplete, title = "" }: PublicImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)

      // Reset upload states
      setUploadProgress(0)
      setUploadComplete(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)

      // Reset upload states
      setUploadProgress(0)
      setUploadComplete(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(10) // Start progress

    try {
      // Generate a filename based on the title or the original filename
      const fileExtension = file.name.split(".").pop()
      const baseFilename = title ? generateSlug(title) : generateSlug(file.name.split(".")[0])
      const filename = `${baseFilename}.${fileExtension}`

      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("filename", filename)

      setUploadProgress(30) // Update progress

      // In a real app, this would be an actual API call
      // For demo purposes, we'll simulate the upload
      setTimeout(() => {
        setUploadProgress(70) // Update progress

        setTimeout(() => {
          setUploadProgress(100) // Complete progress
          setUploadComplete(true)
          setIsUploading(false)

          // Call the callback with the image path
          const imagePath = `/images/${filename}`
          onUploadComplete(imagePath)

          toast({
            title: "Upload complete",
            description: "Image has been saved to public/images directory",
          })
        }, 500)
      }, 1000)

      // In a real app, you would use fetch to upload the file:
      /*
      const response = await fetch('/api/upload-to-public', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload file')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setUploadProgress(100)
        setUploadComplete(true)
        onUploadComplete(data.path)
        
        toast({
          title: "Upload complete",
          description: "Image has been saved to public/images directory",
        })
      } else {
        throw new Error(data.error || 'Failed to upload file')
      }
      */
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setUploadProgress(0)
    setUploadComplete(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          file ? "border-gray-300" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="py-8">
            <div className="flex justify-center mb-2">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">Drag and drop an image here, or click to select</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="mt-4 inline-block">
              <Button type="button" variant="outline" size="sm">
                Select File
              </Button>
            </Label>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex justify-center mb-4">
              {preview && (
                <div className="relative w-40 h-60">
                  <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover rounded" />
                </div>
              )}
            </div>
            <p className="text-sm font-medium mb-1">{file.name}</p>
            <p className="text-xs text-gray-500 mb-2">{(file.size / 1024).toFixed(1)} KB</p>

            {!uploadComplete ? (
              <div className="flex justify-center space-x-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center gap-1"
                >
                  {isUploading ? (
                    <>
                      <span>Uploading ({uploadProgress}%)</span>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3" />
                      Upload to public/images
                    </>
                  )}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={handleReset} disabled={isUploading}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button type="button" size="sm" variant="outline" className="text-green-600" disabled>
                  <Check className="h-3 w-3 mr-1" />
                  Uploaded Successfully
                </Button>
              </div>
            )}

            {isUploading && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
