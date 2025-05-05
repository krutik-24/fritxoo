"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import Image from "next/image"

interface AIPosterGeneratorProps {
  title: string
  onImageGenerated: (imageData: string) => void
  className?: string
}

export default function AIPosterGenerator({ title, onImageGenerated, className = "" }: AIPosterGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async () => {
    if (!title) {
      setError("Please enter a title for your poster")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      setGeneratedImage(data.imageData)
      onImageGenerated(data.imageData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating the image")
      console.error("Error generating image:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">AI Poster Preview</h3>
        <Button
          onClick={generateImage}
          disabled={isGenerating || !title}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              {generatedImage ? "Regenerate Image" : "Generate Image"}
            </>
          )}
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="border rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
        {generatedImage ? (
          <div className="relative w-full aspect-[2/3] max-w-xs mx-auto">
            <Image
              src={`data:image/png;base64,${generatedImage}`}
              alt={`Generated poster for ${title}`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Generating your poster image...</p>
                <p className="text-xs text-gray-400">This may take up to 30 seconds</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p>Enter a title and click "Generate Image"</p>
                <p className="text-xs text-gray-400">Our AI will create a unique poster based on your title</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
