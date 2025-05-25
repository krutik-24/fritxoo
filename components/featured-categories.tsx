import Link from "next/link"
import Image from "next/image"

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
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
