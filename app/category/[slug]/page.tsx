import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PosterCard from "@/components/poster-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Sample data - in a real app, this would come from your database
const CATEGORIES = {
  movies: { name: "Movies", description: "Iconic movie posters for film enthusiasts" },
  "tv-shows": { name: "TV Shows", description: "Posters featuring your favorite television series" },
  music: { name: "Music", description: "Celebrate legendary musicians and bands" },
  sports: { name: "Sports", description: "Sports legends and memorable moments" },
  anime: { name: "Anime", description: "Japanese animation art and characters" },
  gaming: { name: "Gaming", description: "Video game art and characters" },
  minimalist: { name: "Minimalist", description: "Clean, simple designs with a modern aesthetic" },
  typography: { name: "Typography", description: "Beautiful text and lettering designs" },
  cars: { name: "Cars", description: "Stunning automotive designs and classic cars" },
}

// Sample posters organized by category slug
const POSTERS_BY_SLUG = {
  movies: [
    {
      id: "m1",
      title: "The Godfather",
      category: "Movies",
      price: 299,
      imageUrl: "/images/godfather.jpg",
      slug: "the-godfather",
    },
    {
      id: "m2",
      title: "Pulp Fiction",
      category: "Movies",
      price: 249,
      imageUrl: "/images/pulp-fiction.jpg",
      slug: "pulp-fiction",
    },
    {
      id: "m3",
      title: "Inception",
      category: "Movies",
      price: 199,
      imageUrl: "/images/inception.jpg",
      slug: "inception",
    },
    {
      id: "m4",
      title: "The Dark Knight",
      category: "Movies",
      price: 279,
      imageUrl: "/images/dark-knight.jpg",
      slug: "the-dark-knight",
    },
    {
      id: "m5",
      title: "Interstellar",
      category: "Movies",
      price: 249,
      imageUrl: "/images/interstellar.jpg",
      slug: "interstellar",
    },
    {
      id: "m6",
      title: "The Shawshank Redemption",
      category: "Movies",
      price: 299,
      imageUrl: "/images/shawshank.jpg",
      slug: "shawshank-redemption",
    },
    {
      id: "m7",
      title: "Fight Club",
      category: "Movies",
      price: 249,
      imageUrl: "/images/fight-club.jpg",
      slug: "fight-club",
    },
    {
      id: "m8",
      title: "The Matrix",
      category: "Movies",
      price: 249,
      imageUrl: "/images/matrix.jpg",
      slug: "the-matrix",
    },
  ],
  "tv-shows": [
    {
      id: "tv1",
      title: "Breaking Bad",
      category: "TV Shows",
      price: 199,
      imageUrl: "/images/breaking-bad.jpg",
      slug: "breaking-bad",
    },
    {
      id: "tv2",
      title: "Stranger Things",
      category: "TV Shows",
      price: 249,
      imageUrl: "/images/stranger-things.jpg",
      slug: "stranger-things",
    },
    {
      id: "tv3",
      title: "The Walking Dead",
      category: "TV Shows",
      price: 199,
      imageUrl: "/images/walking-dead.jpg",
      slug: "the-walking-dead",
    },
    {
      id: "tv4",
      title: "Game of Thrones",
      category: "TV Shows",
      price: 299,
      imageUrl: "/images/game-of-thrones.jpg",
      slug: "game-of-thrones",
    },
    { id: "tv5", title: "Friends", category: "TV Shows", price: 199, imageUrl: "/images/friends.jpg", slug: "friends" },
    {
      id: "tv6",
      title: "The Office",
      category: "TV Shows",
      price: 199,
      imageUrl: "/images/the-office.jpg",
      slug: "the-office",
    },
    {
      id: "tv7",
      title: "Peaky Blinders",
      category: "TV Shows",
      price: 249,
      imageUrl: "/images/peaky-blinders.jpg",
      slug: "peaky-blinders",
    },
    {
      id: "tv8",
      title: "Money Heist",
      category: "TV Shows",
      price: 249,
      imageUrl: "/images/money-heist.jpg",
      slug: "money-heist",
    },
  ],
  cars: [
    {
      id: "c1",
      title: "Ferrari 250 GTO",
      category: "Cars",
      price: 299,
      imageUrl: "/images/ferrari-250-gto.png",
      slug: "ferrari-250-gto",
    },
    // Other car posters would be defined here
  ],
  // Other categories would be defined similarly
}

// Function to map admin category names to URL slugs
function getCategorySlug(categoryName: string): string {
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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const category = CATEGORIES[slug as keyof typeof CATEGORIES]
  const posters = POSTERS_BY_SLUG[slug as keyof typeof POSTERS_BY_SLUG] || []

  // If category doesn't exist, this would be handled better in a real app
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">{category.name} Posters</h1>
          <p className="text-center mt-2 text-gray-300">{category.description}</p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Link href="/shop">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Categories
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posters.map((poster) => (
              <PosterCard
                key={poster.id}
                id={poster.id}
                title={poster.title}
                category={poster.category}
                price={poster.price}
                imageUrl={poster.imageUrl}
                slug={poster.slug}
              />
            ))}
          </div>

          {posters.length > 8 && (
            <div className="mt-12 text-center">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-bold">LOAD MORE</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
