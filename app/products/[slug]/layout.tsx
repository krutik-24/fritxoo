import type React from "react"
import type { Metadata } from "next"

type Props = {
  params: { slug: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Unknown | 3 Piece Set - Fritxoo`,
    description: "High-quality 3 piece poster set. Transform your space with our personalized posters.",
  }
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>
}
