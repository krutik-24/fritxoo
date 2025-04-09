import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <div className="relative bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
          backgroundPosition: "center",
        }}
      />
      <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-sm">- OVER 100,000+ HAPPY CUSTOMERS!</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 leading-tight">
          TRANSFORM ANY SPACE WITH
          <br />
          <span className="text-5xl md:text-7xl">PERSONALIZED POSTERS</span>
        </h1>

        <div className="mb-8">
          <p className="text-2xl md:text-3xl font-bold mb-2">
            GET YOURS STARTING AT JUST RS. <span className="text-5xl md:text-7xl">99</span>
          </p>
          <p className="text-xl md:text-2xl font-bold">PERSONALIZE YOUR WALLS TODAY!</p>
        </div>

        <Link href="/shop">
          <Button className="bg-white text-black hover:bg-gray-200 font-bold text-lg px-8 py-6">SHOP NOW</Button>
        </Link>

        <p className="mt-8 tracking-widest">AFFORDABLE, AESTHETIC, YOURS.</p>
      </div>
    </div>
  )
}
