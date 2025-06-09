const categories = [
  {
    name: "Cars",
    description: "Stunning automotive designs and classic cars",
    image: "/placeholder.svg?height=300&width=400",
    slug: "cars",
  },
  {
    name: "Movies",
    description: "Iconic movie posters for film enthusiasts",
    image: "/placeholder.svg?height=300&width=400",
    slug: "movies",
  },
  {
    name: "Gaming",
    description: "Video game art and characters",
    image: "/placeholder.svg?height=300&width=400",
    slug: "gaming",
  },
  {
    name: "Minimalist",
    description: "Clean, simple designs with a modern aesthetic",
    image: "/placeholder.svg?height=300&width=400",
    slug: "minimalist",
  },
]

export default function FeaturedCategories() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4"></div>
    </section>
  )
}
