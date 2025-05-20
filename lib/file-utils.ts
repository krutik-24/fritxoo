/**
 * Utility functions for file handling
 */

// Generate a slug from a string (for filenames and URLs)
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Generate a file path for saving to public/images
export function generateFilePath(file: File, title: string): string {
  const extension = file.name.split(".").pop()
  const slug = generateSlug(title)
  return `/images/${slug}.${extension}`
}

// Map admin category names to URL slugs
export function getCategorySlug(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    Movies: "movies",
    "TV Shows": "tv-shows",
    Music: "music",
    Sports: "sports",
    Anime: "anime",
    Gaming: "gaming",
    Minimalist: "minimalist",
    Typography: "typography",
    Cars: "cars",
  }
  return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, "-")
}

// Map URL slugs to admin category names
export function getCategoryName(slug: string): string {
  const slugMap: Record<string, string> = {
    movies: "Movies",
    "tv-shows": "TV Shows",
    music: "Music",
    sports: "Sports",
    anime: "Anime",
    gaming: "Gaming",
    minimalist: "Minimalist",
    typography: "Typography",
    cars: "Cars",
  }
  return (
    slugMap[slug] ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
}
