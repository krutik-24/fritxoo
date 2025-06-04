import type { Metadata } from "next"
import MoviesPage from "@/components/movies-page"

export const metadata: Metadata = {
  title: "Movie Posters | Premium Cinema Collection",
  description:
    "Discover our premium collection of movie posters featuring classic films, blockbusters, and iconic cinema moments. High-quality prints available in A4 and A3 sizes.",
  keywords: "movie posters, cinema posters, film prints, classic movies, blockbuster posters",
}

export default function CategoryMoviesPage() {
  return <MoviesPage />
}
