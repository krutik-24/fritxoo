"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePosters } from "@/context/poster-context"
import { useRouter } from "next/navigation"

export default function CustomPoster() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { addPoster } = usePosters()
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      setUploadSuccess(false)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // Create a synthetic event to reuse the file selection logic
      const syntheticEvent = {
        target: { files: [file] },
      } as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(syntheticEvent)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a local URL for the image (this will only work during the current session)
      const imageUrl = URL.createObjectURL(selectedFile)

      // Add the poster to our context
      addPoster({
        title: selectedFile.name.split(".")[0], // Use filename as title
        category: "Cars", // Default category
        price: 99,
        priceA3: 149,
        description: "Custom uploaded poster",
        imageUrl: imageUrl,
        featured: false,
      })

      setUploadSuccess(true)
      toast({
        title: "Upload successful!",
        description: `${selectedFile.name} has been added to your posters`,
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleBrowseFiles = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setUploadSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: "Your custom poster has been added to your cart",
    })

    // Redirect to cars category to see the uploaded poster
    router.push("/category/cars")
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Upload Your Custom Poster</h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Preview</h3>
              <div className="aspect-[2/3] rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {previewUrl ? (
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Your image preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Upload Image</h3>

              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={handleBrowseFiles}
                >
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your image here</p>
                  <p className="text-gray-400 text-sm mb-4">or click to browse files</p>
                  <p className="text-gray-400 text-xs">Supports JPG, PNG (Max 10MB)</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ImageIcon className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {uploadSuccess && <CheckCircle className="h-6 w-6 text-green-500" />}
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleUpload} disabled={uploading || uploadSuccess} className="flex-1">
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : uploadSuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Processed
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Process Image
                        </>
                      )}
                    </Button>

                    <Button onClick={resetUpload} variant="outline" disabled={uploading}>
                      Reset
                    </Button>
                  </div>

                  {uploadSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-800 font-medium">Upload Successful!</p>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Your image has been processed and added to the Cars category. You can view it there or add it to
                        your cart.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-2xl">Rs. 199</p>
                    <p className="text-gray-500 text-sm">Custom poster printing</p>
                    <p className="text-gray-500 text-sm">Free shipping on orders above Rs. 499</p>
                  </div>
                  <Button
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={!uploadSuccess}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Upload Instructions:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Upload high-resolution images for best print quality</li>
              <li>• Recommended minimum resolution: 300 DPI</li>
              <li>• Supported formats: JPG, PNG</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Your uploaded posters will appear in the Cars category</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
