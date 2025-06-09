import type { Metadata } from "next"
import AnimeClientPageComponent from "./AnimeClientPage"

export const metadata: Metadata = {
  title: "Anime Posters | Premium One Piece Wanted Posters",
  description:
    "Shop our exclusive collection of anime posters featuring One Piece wanted posters and premium Straw Hat Pirates collage",
}

export default function Page() {
  return <AnimeClientPageComponent />
}
