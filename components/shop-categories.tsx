import type React from "react"
import { Car, Film, Layout } from "lucide-react"

interface Category {
  name: string
  description: string
  icon: React.ComponentType
  href: string
  color: string
  count: string
}

const categories: Category[] = [
  {
    name: "Cars",
    description: "Automotive posters featuring supercars, classics, and racing",
    icon: Car,
    href: "/category/cars",
    color: "from-red-500 to-orange-500",
    count: "15+ designs",
  },
  {
    name: "Movies",
    description: "Cinema posters from blockbusters to cult classics",
    icon: Film,
    href: "/category/movies",
    color: "from-blue-500 to-purple-500",
    count: "10+ designs",
  },
  {
    name: "Split Posters",
    description: "Premium split-panel designs for modern aesthetics",
    icon: Layout,
    href: "/split-posters",
    color: "from-purple-500 to-pink-500",
    count: "8+ designs",
  },
]

export default categories
