import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    // Get the file data from the request
    const file = await request.blob()

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are supported." },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Generate a unique filename to avoid collisions
    // Store in the 'cars' folder in blob storage
    const uniqueFilename = `cars/${Date.now()}-${filename}`

    // Upload to Vercel Blob Storage
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error("Error uploading to blob storage:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
