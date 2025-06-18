"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { generateSlug } from "@/lib/file-utils"

// Define poster type with size options
export interface Poster {
  id: string
  title: string
  category: string
  price: number
  priceA3: number
  description: string
  imageUrl: string
  slug: string
  size?: "A4" | "A3" | "A3+"
  featured?: boolean
}

// Define the context type
interface PosterContextType {
  posters: Poster[]
  addPoster: (poster: Omit<Poster, "id" | "slug">) => void
  updatePoster: (id: string, poster: Partial<Poster>) => void
  deletePoster: (id: string) => void
  getPostersByCategory: (category: string) => Poster[]
  getFeaturedPosters: () => Poster[]
  getPosterById: (id: string) => Poster | undefined
  loading: boolean
}

// Create the context
const PosterContext = createContext<PosterContextType | undefined>(undefined)

// Helper function to validate and fix image URLs
const validateImageUrl = (url: string, title: string): string => {
  if (!url || url === "undefined" || url === "null") {
    return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(title)}`
  }

  // Check for problematic blob URLs
  if (url.startsWith("blob:") && !url.includes("v0.dev") && !url.includes("vercel-storage.com")) {
    console.warn(`Removing problematic blob URL for ${title}: ${url}`)
    return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(title)}`
  }

  // Ensure HTTPS for external URLs
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://")
  }

  return url
}

// Provider component
export function PosterProvider({ children }: { children: ReactNode }) {
  const [posters, setPosters] = useState<Poster[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize with all posters
  useEffect(() => {
    const loadPosters = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Complete collection of all posters with working image URLs
      const completePosters = [
        // CAR POSTERS - A4: ₹99, A3: ₹149
        {
          id: "1",
          title: "Ferrari 250 GTO",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Classic Ferrari 250 GTO sports car",
          imageUrl: "/images/ferrari-250-gto.png",
          slug: "ferrari-250-gto",
          featured: true,
        },
        {
          id: "3",
          title: "1984 Audi Sport Quattro",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Iconic 1984 Audi Sport Quattro rally car",
          imageUrl: "/images/audi-sport-quattro.jpg",
          slug: "audi-sport-quattro",
          featured: false,
        },
        {
          id: "4",
          title: "1999 Nissan Skyline GT-R R34",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Legendary 1999 Nissan Skyline GT-R R34 sports car",
          imageUrl: "/images/nissan-skyline-gtr-r34.jpg",
          slug: "nissan-skyline-gtr-r34",
          featured: false,
        },
        {
          id: "5",
          title: "Ferrari F40 - Unleash The Legend",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Ferrari F40 supercar with performance specifications",
          imageUrl: "/images/ferrari-f40.png",
          slug: "ferrari-f40-unleash-legend",
          featured: true,
        },
        {
          id: "6",
          title: "Bugatti Chiron - Engineered For Gods",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Bugatti Chiron hypercar in cyberpunk setting",
          imageUrl: "/images/bugatti-chiron.png",
          slug: "bugatti-chiron-engineered-gods",
          featured: false,
        },
        {
          id: "7",
          title: "Aston Martin DBS - Master The Machine",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Aston Martin DBS grand tourer",
          imageUrl: "/images/aston-martin-dbs.png",
          slug: "aston-martin-dbs-master-machine",
          featured: false,
        },
        {
          id: "8",
          title: "Lamborghini Aventador - Unleash The Rage",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Lamborghini Aventador supercar with dramatic lighting",
          imageUrl: "/images/lamborghini-aventador.png",
          slug: "lamborghini-aventador-unleash-rage",
          featured: false,
        },
        {
          id: "9",
          title: "Toyota Century - Timeless Regal",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Toyota Century luxury sedan in nighttime setting",
          imageUrl: "/images/toyota-century.png",
          slug: "toyota-century-timeless-regal",
          featured: false,
        },
        {
          id: "10",
          title: "1961 Jaguar E-Type Series 1",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Classic 1961 Jaguar E-Type Series 1 sports car",
          imageUrl: "/images/jaguar-e-type.png",
          slug: "jaguar-e-type-series-1",
          featured: false,
        },
        {
          id: "11",
          title: "The Last Breath of Fire",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Ferrari with dramatic fire effects and red lighting",
          imageUrl: "/images/ferrari-fire.png",
          slug: "last-breath-fire",
          featured: false,
        },
        {
          id: "12",
          title: "Hellcat - Dominate The Streets",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Dodge Challenger Hellcat muscle car",
          imageUrl: "/images/hellcat-dominate.png",
          slug: "hellcat-dominate-streets",
          featured: false,
        },
        {
          id: "13",
          title: "Unleash The Hemi Power",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Dodge Challenger with Hemi engine power",
          imageUrl: "/images/hellcat-hemi.png",
          slug: "unleash-hemi-power",
          featured: false,
        },
        {
          id: "14",
          title: "1963 Ferrari 250 GTO",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Classic 1963 Ferrari 250 GTO racing legend",
          imageUrl: "/images/ferrari-250-gto-63.png",
          slug: "ferrari-250-gto-1963",
          featured: false,
        },
        // MOVIE POSTERS - A4: ₹99, A3: ₹149
        {
          id: "movie-1",
          title: "The OG - They Call Him OG",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description:
            "Pawan Kalyan in The OG - Action thriller poster featuring the iconic 'They Call Him OG' tagline",
          imageUrl: "/images/the-og.png",
          slug: "the-og-they-call-him-og",
          featured: true,
        },
        {
          id: "movie-2",
          title: "The Godfather",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "Classic Godfather movie poster featuring Marlon Brando with the iconic puppet strings imagery",
          imageUrl: "/images/the-godfather.png",
          slug: "the-godfather",
          featured: true,
        },
        {
          id: "movie-3",
          title: "American Psycho",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "American Psycho movie poster directed by Mary Harron - Minimalist design with cast credits",
          imageUrl: "/images/american-psycho.png",
          slug: "american-psycho",
          featured: true,
        },
        {
          id: "movie-4",
          title: "The Batman",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "The Batman movie poster with dark noir aesthetic featuring Batman in the rain",
          imageUrl: "/images/the-batman.png",
          slug: "the-batman",
          featured: false,
        },
        {
          id: "movie-5",
          title: "Batman - Brave",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "Batman poster with 'Brave' typography in dark, gritty style showcasing the Dark Knight",
          imageUrl: "/images/batman-brave.png",
          slug: "batman-brave",
          featured: false,
        },
        {
          id: "movie-6",
          title: "Scarface - Say Hello to My Little Friend",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "Classic Scarface movie poster featuring Tony Montana with weapon on red background",
          imageUrl: "/images/scarface-new.png",
          slug: "scarface-say-hello",
          featured: true,
        },
        {
          id: "movie-7",
          title: "Rambo - First Blood",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "Rambo movie poster featuring John Rambo with bow and arrow on red background",
          imageUrl: "/images/rambo-first-blood-new.png",
          slug: "rambo-first-blood",
          featured: true,
        },
        {
          id: "movie-8",
          title: "Game of Thrones - Jon Snow",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description:
            "Game of Thrones poster featuring Jon Snow with Ghost and raven - 'Can a man still be brave if he's afraid?'",
          imageUrl: "/images/game-of-thrones-jon-snow-new.png",
          slug: "game-of-thrones-jon-snow",
          featured: true,
        },
        // ANIME POSTERS - A4: ₹99, A3: ₹149
        {
          id: "anime-1",
          title: "Brook - Soul King Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Brook wanted poster - Dead or Alive with ฿33,000,000 bounty",
          imageUrl: "/images/brook-wanted.png",
          slug: "brook-soul-king-wanted",
          featured: true,
        },
        {
          id: "anime-2",
          title: "Monkey D. Luffy Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Luffy wanted poster - Straw Hat Captain with ฿3,000,000,000 bounty",
          imageUrl: "/images/luffy-wanted.png",
          slug: "monkey-d-luffy-wanted",
          featured: true,
        },
        {
          id: "anime-3",
          title: "Portgas D. Ace Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Ace wanted poster - Fire Fist with ฿500,000,000 bounty",
          imageUrl: "/images/ace-wanted.png",
          slug: "portgas-d-ace-wanted",
          featured: true,
        },
        {
          id: "anime-4",
          title: "Trafalgar Law Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Law wanted poster - Surgeon of Death with ฿500,000,000 bounty",
          imageUrl: "/images/law-wanted.png",
          slug: "trafalgar-law-wanted",
          featured: false,
        },
        {
          id: "anime-5",
          title: "Nami Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Nami wanted poster - Cat Burglar with ฿366,000,000 bounty",
          imageUrl: "/images/nami-wanted.png",
          slug: "nami-wanted",
          featured: true,
        },
        {
          id: "anime-6",
          title: "Roronoa Zoro Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Zoro wanted poster - Pirate Hunter with ฿320,000,000 bounty",
          imageUrl: "/images/zoro-wanted.png",
          slug: "roronoa-zoro-wanted",
          featured: true,
        },
        {
          id: "anime-7",
          title: "Nico Robin Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Robin wanted poster - Devil Child with ฿130,000,000 bounty",
          imageUrl: "/images/robin-wanted.png",
          slug: "nico-robin-wanted",
          featured: false,
        },
        {
          id: "anime-8",
          title: "God Usopp Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Usopp wanted poster - Sniper King with ฿200,000,000 bounty",
          imageUrl: "/images/usopp-wanted.png",
          slug: "god-usopp-wanted",
          featured: false,
        },
        {
          id: "anime-9",
          title: "Red-Haired Shanks Wanted Poster",
          category: "Anime",
          price: 99,
          priceA3: 149,
          description: "One Piece Shanks wanted poster - Emperor of the Sea with ฿4,048,900,000 bounty",
          imageUrl: "/images/shanks-wanted.png",
          slug: "red-haired-shanks-wanted",
          featured: true,
        },
        // Special premium Straw Hats crew collage poster
        {
          id: "anime-10",
          title: "Straw Hat Pirates Wanted Posters Collage",
          category: "Collage",
          price: 699,
          priceA3: 999,
          description:
            "Premium One Piece collage featuring all Straw Hat crew members' wanted posters including Luffy, Zoro, Nami, Usopp, Sanji, Chopper, Robin, Brook, and Jinbe",
          imageUrl: "/images/straw-hats-crew-collage.jpg",
          slug: "straw-hat-pirates-collage",
          featured: true,
        },
        // SPLIT POSTERS - A4: ₹299, A3: ₹399
        {
          id: "split-jersey",
          title: "Jersey - It's Never Late to Try Again",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description:
            "Inspirational Jersey split poster with motivational message - It's Never Late to Try Again. Features cricket celebration scene with split-panel design on dark green background.",
          imageUrl: "/images/jersey-split-updated.png",
          slug: "jersey-never-late-try-again",
          featured: true,
        },
        {
          id: "split-1",
          title: "Aston Martin DBS - Superleggera Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "Premium split-panel Aston Martin DBS poster with elegant green backdrop",
          imageUrl: "/images/split-aston-martin.png",
          slug: "aston-martin-dbs-split",
          featured: true,
        },
        {
          id: "split-2",
          title: "Mercedes AMG - Beastmode Black Series Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "High-performance Mercedes AMG split poster with dramatic orange styling",
          imageUrl: "/images/split-amg-beastmode.png",
          slug: "mercedes-amg-beastmode-split",
          featured: true,
        },
        {
          id: "split-4",
          title: "Ferrari 812 Superfast Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "Iconic Ferrari 812 Superfast split poster with bold red typography",
          imageUrl: "/images/split-ferrari.png",
          slug: "ferrari-812-superfast-split",
          featured: true,
        },
        {
          id: "split-5",
          title: "Porsche 911 GT3 RS - Obsession Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "Porsche 911 GT3 RS split poster showcasing obsession for perfection",
          imageUrl: "/images/split-gt3rs.png",
          slug: "porsche-gt3rs-obsession-split",
          featured: true,
        },
        {
          id: "split-3",
          title: "Land Rover Defender - Off-Road Beast Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "Rugged Land Rover Defender split poster showcasing off-road capability and adventure spirit",
          imageUrl: "/images/split-defender.png",
          slug: "land-rover-defender-split",
          featured: true,
        },
        {
          id: "split-6",
          title: "Peaky Blinders - By Order Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "Peaky Blinders themed split poster with vintage Birmingham aesthetic and iconic styling",
          imageUrl: "/images/split-peaky-blinders.png",
          slug: "peaky-blinders-order-split",
          featured: true,
        },
        {
          id: "split-7",
          title: "Lamborghini Huracán - Raging Bull Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "Lamborghini Huracán split poster with dramatic lighting and aggressive styling",
          imageUrl: "/images/split-lamborghini.png",
          slug: "lamborghini-huracan-split",
          featured: true,
        },
        {
          id: "split-8",
          title: "Rimac Nevera - Electric Hypercar Split",
          category: "Split Posters",
          price: 299,
          priceA3: 399,
          description: "Rimac Nevera electric hypercar split poster showcasing cutting-edge automotive technology",
          imageUrl: "/images/split-rimac-nevera.png",
          slug: "rimac-nevera-electric-split",
          featured: true,
        },
      ]

      const validatedPosters = completePosters.map((poster) => ({
        ...poster,
        imageUrl: validateImageUrl(poster.imageUrl, poster.title),
      }))

      setPosters(validatedPosters)
      setLoading(false)
    }

    loadPosters()
  }, [])

  // Add a new poster
  const addPoster = (posterData: Omit<Poster, "id" | "slug">) => {
    const id = Date.now().toString()
    const slug = generateSlug(posterData.title)

    const newPoster: Poster = {
      ...posterData,
      id,
      slug,
      price: posterData.price || (posterData.category === "Split Posters" ? 299 : 99),
      priceA3: posterData.priceA3 || (posterData.category === "Split Posters" ? 399 : 149),
      imageUrl: validateImageUrl(posterData.imageUrl, posterData.title),
    }

    setPosters((prevPosters) => [...prevPosters, newPoster])
  }

  // Update an existing poster
  const updatePoster = (id: string, posterData: Partial<Poster>) => {
    setPosters((prevPosters) =>
      prevPosters.map((poster) => {
        if (poster.id === id) {
          let slug = poster.slug
          if (posterData.title && posterData.title !== poster.title) {
            slug = generateSlug(posterData.title)
          }

          let imageUrl = poster.imageUrl
          if (posterData.imageUrl) {
            imageUrl = validateImageUrl(posterData.imageUrl, posterData.title || poster.title)
          }

          return {
            ...poster,
            ...posterData,
            slug,
            imageUrl,
          }
        }
        return poster
      }),
    )
  }

  // Delete a poster
  const deletePoster = (id: string) => {
    setPosters((prevPosters) => prevPosters.filter((poster) => poster.id !== id))
  }

  // Get posters by category
  const getPostersByCategory = (category: string) => {
    const formattedCategory = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return posters.filter((poster) => {
      return poster.category.toLowerCase() === formattedCategory.toLowerCase()
    })
  }

  // Get featured posters
  const getFeaturedPosters = () => {
    return posters.filter((poster) => poster.featured === true)
  }

  // Get poster by ID
  const getPosterById = (id: string) => {
    return posters.find((poster) => poster.id === id)
  }

  return (
    <PosterContext.Provider
      value={{
        posters,
        addPoster,
        updatePoster,
        deletePoster,
        getPostersByCategory,
        getFeaturedPosters,
        getPosterById,
        loading,
      }}
    >
      {children}
    </PosterContext.Provider>
  )
}

// Custom hook to use the poster context
export function usePosters() {
  const context = useContext(PosterContext)
  if (context === undefined) {
    throw new Error("usePosters must be used within a PosterProvider")
  }
  return context
}
