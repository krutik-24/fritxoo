import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const filename = formData.get("filename") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Ensure the directory exists
    const directory = join(process.cwd(), "public", "images")
    if (!existsSync(directory)) {
      await mkdir(directory, { recursive: true })
    }

    // Define the path where the file will be saved
    const path = join(directory, filename)

    // Write the file to the public/images directory
    await writeFile(path, buffer)

    // Return the path where the file was saved
    return NextResponse.json({
      success: true,
      path: `/images/${filename}`,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
