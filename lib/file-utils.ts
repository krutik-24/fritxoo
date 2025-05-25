/**
 * Generates a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  if (!text) return ""

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim() // Remove whitespace from both ends
}

/**
 * Generates a file path for saving an image
 */
export function generateFilePath(file: File, title: string): string {
  if (!file || !title) return ""

  const fileExtension = file.name.split(".").pop() || ""
  const slug = generateSlug(title)
  return `/images/${slug}.${fileExtension}`
}

/**
 * Creates a data URL preview for a file
 */
export async function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

/**
 * Formats a price as currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
