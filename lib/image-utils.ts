/**
 * Preload critical images for better performance
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Validate if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    await preloadImage(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get optimized image URL with fallback
 */
export function getOptimizedImageUrl(
  url: string,
  title: string,
  size: "small" | "medium" | "large" = "medium",
): string {
  if (!url || url === "undefined" || url === "null") {
    const dimensions = {
      small: "height=200&width=200",
      medium: "height=400&width=300",
      large: "height=600&width=600",
    }
    return `/placeholder.svg?${dimensions[size]}&text=${encodeURIComponent(title)}`
  }

  // Handle blob URLs - only allow trusted sources
  if (url.startsWith("blob:")) {
    if (url.includes("v0.dev") || url.includes("vercel-storage.com")) {
      return url
    } else {
      console.warn(`Untrusted blob URL for ${title}: ${url}`)
      const dimensions = {
        small: "height=200&width=200",
        medium: "height=400&width=300",
        large: "height=600&width=600",
      }
      return `/placeholder.svg?${dimensions[size]}&text=${encodeURIComponent(title)}`
    }
  }

  // Handle relative paths
  if (url.startsWith("/images/") || url.startsWith("/placeholder.svg")) {
    return url
  }

  // Handle external URLs
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://")
  }

  if (url.startsWith("https://")) {
    return url
  }

  // Default fallback
  const dimensions = {
    small: "height=200&width=200",
    medium: "height=400&width=300",
    large: "height=600&width=600",
  }
  return `/placeholder.svg?${dimensions[size]}&text=${encodeURIComponent(title)}`
}

/**
 * Batch preload images for a list of posters
 */
export async function preloadPosterImages(
  posters: Array<{ imageUrl: string; title: string }>,
  limit = 5,
): Promise<void> {
  const imagesToPreload = posters.slice(0, limit)

  const preloadPromises = imagesToPreload.map((poster) => {
    const optimizedUrl = getOptimizedImageUrl(poster.imageUrl, poster.title)
    return preloadImage(optimizedUrl).catch((error) => {
      console.warn(`Failed to preload image for ${poster.title}:`, error)
    })
  })

  await Promise.allSettled(preloadPromises)
}
