import type { Metadata } from "next"
import JerseyPosterVerification from "@/components/jersey-poster-verification"

export const metadata: Metadata = {
  title: "Jersey Poster Verification | Admin Tools",
  description: "Comprehensive verification tool for jersey poster visibility and functionality",
}

export default function JerseyPosterVerificationPage() {
  return <JerseyPosterVerification />
}
