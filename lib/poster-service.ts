// This is a mock service for poster data
// In a real app, this would interact with your database

import { generateSlug } from "./file-utils"

export interface Poster {
  id: string
  title: string
  category: string
  price: number
  description: string
  imageUrl: string
  slug: string
}

// Mock data for demonstration
const MOCK_POSTERS: Record<string, Poster> = {
  "1": {
    id: "1",
    title: "Cyberpunk City",
    category: "Gaming",
    price: 199,
    description: "A futuristic cityscape with neon lights",
    imageUrl: "/images/cyberpunk-city.jpg",
    slug: "cyberpunk-city",
  },
  "2": {
    id: "2",
    title: "Sunset Beach",
    category: "Minimalist",
    price: 249,
    description: "Peaceful beach scene at sunset",
    imageUrl: "/images/sunset-beach.jpg",
    slug: "sunset-beach",
  },
  "3": {
    id: "3",
    title: "Ferrari 250 GTO",
    category: "Cars",
    price: 299,
    description: "Classic Ferrari 250 GTO sports car",
    imageUrl: "/images/ferrari-250-gto.png",
    slug: "ferrari-250-gto",
  },
}

// Get all posters
export async function getAllPosters(): Promise<Poster[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return Object.values(MOCK_POSTERS)
}

// Get poster by ID
export async function getPosterById(id: string): Promise<Poster | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_POSTERS[id] || null
}

// Get posters by category
export async function getPostersByCategory(category: string): Promise<Poster[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Convert category to match the format in the data
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()

  return Object.values(MOCK_POSTERS).filter(
    (poster) => poster.category.toLowerCase() === formattedCategory.toLowerCase(),
  )
}

// Create a new poster
export async function createPoster(posterData: Omit<Poster, "id" | "slug">): Promise<Poster> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const id = Date.now().toString()
  const slug = generateSlug(posterData.title)

  const newPoster: Poster = {
    ...posterData,
    id,
    slug,
  }

  // In a real app, this would save to a database
  MOCK_POSTERS[id] = newPoster

  return newPoster
}

// Update an existing poster
export async function updatePoster(id: string, posterData: Partial<Omit<Poster, "id">>): Promise<Poster | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const poster = MOCK_POSTERS[id]
  if (!poster) return null

  // Update the slug if the title has changed
  let slug = poster.slug
  if (posterData.title && posterData.title !== poster.title) {
    slug = generateSlug(posterData.title)
  }

  const updatedPoster: Poster = {
    ...poster,
    ...posterData,
    slug,
  }

  // In a real app, this would update in a database
  MOCK_POSTERS[id] = updatedPoster

  return updatedPoster
}

// Delete a poster
export async function deletePoster(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (!MOCK_POSTERS[id]) return false

  // In a real app, this would delete from a database
  delete MOCK_POSTERS[id]

  return true
}
