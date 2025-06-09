import type { Metadata } from "next"
import CollageClientPage from "./CollageClientPage"

export const metadata: Metadata = {
  title: "Collage Posters | Premium Multi-Character Collections",
  description:
    "Shop our exclusive collection of collage posters featuring multiple characters and themes in stunning arrangements",
}

export default function Page() {
  return <CollageClientPage />
}
