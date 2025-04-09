import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Movie Posters",
    image: "/placeholder.svg?height=300&width=200",
    link: "/category/movies",
  },
  {
    name: "TV Show Posters",
    image: "/placeholder.svg?height=300&width=200",
    link: "/category/tv-shows",
  },
  {
    name: "Music Posters",
    image: "/placeholder.svg?height=300&width=200",
    link: "/category/music",
  },
  {
    name: "Sports Posters",
    image: "/placeholder.svg?height=300&width=200",
    link: "/category/sports",
  },
]

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.link} className="group">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={200}
                  height={300}
                  className="w-full h-auto object-cover aspect-[2/3] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white font-semibold p-4 w-full text-center">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
