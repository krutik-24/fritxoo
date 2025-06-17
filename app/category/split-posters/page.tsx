import type { Metadata } from "next"
import SplitPostersPage from "@/components/split-posters-page"

export const metadata: Metadata = {
  title: "Premium Split Posters | Artistic Triptych Collection",
  description:
    "Discover our premium collection of split-panel posters featuring automotive masterpieces and entertainment classics. High-quality triptych designs for modern spaces.",
}

export default function SplitPosters() {
  return <SplitPostersPage />
}
