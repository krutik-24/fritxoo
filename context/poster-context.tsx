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

// Provider component
export function PosterProvider({ children }: { children: ReactNode }) {
  const [posters, setPosters] = useState<Poster[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize with all posters
  useEffect(() => {
    const loadPosters = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Complete collection of all posters
      const completePosters = [
        // CAR POSTERS
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
          id: "2",
          title: "1984 Audi Sport Quattro",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Iconic 1984 Audi Sport Quattro rally car",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audi.jpg-yCWRGWaZF7TBITD9awP7MDRDUNdqD9.jpeg",
          slug: "audi-sport-quattro",
          featured: true,
        },
        {
          id: "3",
          title: "1999 Nissan Skyline GT-R R34",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Legendary 1999 Nissan Skyline GT-R R34 sports car",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/skyline%20gtr-LzO6YsF9uky63dV5JcyCrpVE4EQayW.png",
          slug: "nissan-skyline-gtr-r34",
          featured: false,
        },
        {
          id: "4",
          title: "Ferrari F40 - Unleash The Legend",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Ferrari F40 supercar with performance specifications",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f40-ZN0pg4Nt3WLOMi5IVbfT7IqR63FMKG.png",
          slug: "ferrari-f40-unleash-legend",
          featured: true,
        },
        {
          id: "5",
          title: "Bugatti Chiron - Engineered For Gods",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Bugatti Chiron hypercar in cyberpunk setting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chiron-ES4dcM11iPyaJjT9bdPcmnVUJMF5q0.png",
          slug: "bugatti-chiron-engineered-gods",
          featured: false,
        },
        {
          id: "6",
          title: "Aston Martin DBS - Master The Machine",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Aston Martin DBS grand tourer",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dbs-7d4e0T86gDejDDqYLqr19mFDaGRiEl.png",
          slug: "aston-martin-dbs-master-machine",
          featured: false,
        },
        {
          id: "7",
          title: "Lamborghini Aventador - Unleash The Rage",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Lamborghini Aventador supercar with dramatic lighting",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aventedor-lSaXHHYAO1bIVQobghVl2exRf9lpWI.png",
          slug: "lamborghini-aventador-unleash-rage",
          featured: false,
        },
        {
          id: "8",
          title: "Toyota Century - Timeless Regal",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Toyota Century luxury sedan in nighttime setting",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/century-jNhFbPZWuq9X3wQrT9ecxSFiUSOzg7.png",
          slug: "toyota-century-timeless-regal",
          featured: false,
        },
        {
          id: "9",
          title: "1961 Jaguar E-Type Series 1",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Classic 1961 Jaguar E-Type Series 1 sports car",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jaguar-epMkvmwhu5Rva5zfSIYTMUFHyodeSo.png",
          slug: "jaguar-e-type-series-1",
          featured: false,
        },
        {
          id: "10",
          title: "The Last Breath of Fire",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Ferrari with dramatic fire effects and red lighting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fire-c5vNAHhVZDJywPXaN8Fe0kbGcgDoAB.png",
          slug: "last-breath-fire",
          featured: false,
        },
        {
          id: "11",
          title: "Hellcat - Dominate The Streets",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Dodge Challenger Hellcat muscle car",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hell%20cat-yRJa8R9n9qIyHETBhkJKh4NqtDOdqN.png",
          slug: "hellcat-dominate-streets",
          featured: false,
        },
        {
          id: "12",
          title: "Unleash The Hemi Power",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Dodge Challenger with Hemi engine power",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hell%20cat2-zVVy2fyLkrT4haivvQIdRWbel5oVg9.png",
          slug: "unleash-hemi-power",
          featured: false,
        },
        {
          id: "13",
          title: "1963 Ferrari 250 GTO",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Classic 1963 Ferrari 250 GTO racing legend",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ferrari-hRveuEHk6KdgPC6G7yhnPY7z810KXn.png",
          slug: "ferrari-250-gto-1963",
          featured: false,
        },
        {
          id: "14",
          title: "Porsche Turbo S - Where Elegance Meets Velocity",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Porsche 911 Turbo S on mountain roads with dramatic lighting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/porche-LXNOkw4tWeCj0NV7E80ahQsE123bST.png",
          slug: "porsche-turbo-s-elegance-velocity",
          featured: true,
        },
        {
          id: "15",
          title: "Rage of Retro - Lamborghini Countach",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Retro synthwave Lamborghini Countach poster with 80s aesthetic",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lambo-GFUUouynIi1HvvbF10S7ZwHXWC9ZCm.png",
          slug: "rage-retro-lamborghini-countach",
          featured: false,
        },
        {
          id: "16",
          title: "Godzilla - The Beast From The East",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Nissan Skyline GT-R R34 in cyberpunk setting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r34-cES6uiUWHm3piAAZKSuOjswkucEauP.png",
          slug: "godzilla-beast-east-r34",
          featured: false,
        },
        {
          id: "17",
          title: "1970 Ford Mustang Boss 302",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Classic 1970 Ford Mustang Boss 302 in minimalist design",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mustang-LmDaskP6cWgV0rkeP43Jhd5OMqFgTq.png",
          slug: "ford-mustang-boss-302-1970",
          featured: false,
        },
        {
          id: "18",
          title: "Skyline GT-R R32 - Cherry Blossom",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Nissan Skyline GT-R R32 under cherry blossom tree",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r32-jCt4k0ZXAB2Cxeqx83LxkrR4ueU3c4.png",
          slug: "skyline-gtr-r32-cherry-blossom",
          featured: false,
        },
        {
          id: "19",
          title: "Legend Reborn - Toyota Supra",
          category: "Cars",
          price: 99,
          priceA3: 149,
          description: "Toyota Supra in cyberpunk cityscape - Built for the street, born to dominate",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supra-PDeR5Kc4OYt6BR8lrlCC4NtUmkBnMq.png",
          slug: "legend-reborn-toyota-supra",
          featured: false,
        },
        // MOVIE POSTERS
        {
          id: "20",
          title: "The OG - They Call Him OG",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "Pawan Kalyan in The OG - Action thriller poster",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OG-ZsXTjXKgzFL8JUrzEWn3IHueBxNNXi.png",
          slug: "the-og-they-call-him-og",
          featured: true,
        },
        {
          id: "21",
          title: "The Godfather",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "Classic Godfather movie poster with Marlon Brando",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GF-o8xChpri3zVp0NGwrNIjfRv6AO9eJx.png",
          slug: "the-godfather",
          featured: true,
        },
        {
          id: "22",
          title: "American Psycho",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "American Psycho movie poster directed by Mary Harron",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AP-Dd5FvAHy2f4jcDHHPnTFbXhVPhqp1F.png",
          slug: "american-psycho",
          featured: false,
        },
        {
          id: "23",
          title: "The Batman",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "The Batman movie poster with dark noir aesthetic",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BM-5ICYnkqnTbThKrEfExkP7GfqTCf5Ya.png",
          slug: "the-batman",
          featured: true,
        },
        {
          id: "24",
          title: "Batman - Brave",
          category: "Movies",
          price: 99,
          priceA3: 149,
          description: "Batman poster with 'Brave' typography in dark, gritty style",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BM2-7zL7F0Ayzksxt0Mtt61RDODYHalX1L.png",
          slug: "batman-brave",
          featured: false,
        },
        // SPLIT POSTERS - PREMIUM COLLECTION
        {
          id: "25",
          title: "Aston Martin DBS - Superleggera Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "Premium split-panel Aston Martin DBS poster with elegant green backdrop",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/am-MuhCzhcVliuFqBlZ7hP2yCjt358H3I.png",
          slug: "aston-martin-dbs-split",
          featured: true,
        },
        {
          id: "26",
          title: "Mercedes AMG - Beastmode Black Series Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "High-performance Mercedes AMG split poster with dramatic orange styling",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amg-p9qIz5OqGT1uDqRHF1ScB7ITibpTTa.png",
          slug: "mercedes-amg-beastmode-split",
          featured: true,
        },
        {
          id: "27",
          title: "Land Rover Defender Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "Rugged Land Rover Defender 130 split-panel poster in minimalist black design",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/def-j797cvn1BTFYekS0mtkiybcdZuwuVW.png",
          slug: "land-rover-defender-split",
          featured: false,
        },
        {
          id: "28",
          title: "Ferrari 812 Superfast Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "Iconic Ferrari 812 Superfast split poster with bold red typography",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fef-AGL5t7T5vBlyZTzqJKg2VyztyjSpJe.png",
          slug: "ferrari-812-superfast-split",
          featured: true,
        },
        {
          id: "29",
          title: "Porsche 911 GT3 RS - Obsession Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "Porsche 911 GT3 RS split poster showcasing obsession for perfection",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gt3rs-Jdtlcjl5C9jn6gjxT6clJApVQ17ehl.png",
          slug: "porsche-gt3rs-obsession-split",
          featured: true,
        },
        {
          id: "30",
          title: "Peaky Blinders - By Order Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "Vintage Peaky Blinders split poster with authentic period styling",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pb-F7RaPBGDoq49lbPTo4Flyn7PsAYTLr.png",
          slug: "peaky-blinders-split",
          featured: false,
        },
        {
          id: "31",
          title: "Lamborghini Huracan - Instinct Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "Lamborghini Huracan Tecnica split poster with Japanese-inspired design",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lambo-1d5rhvak6nvpFx8hBIjmCD4lCkkfb5.png",
          slug: "lamborghini-huracan-instinct-split",
          featured: false,
        },
        {
          id: "32",
          title: "Rimac Nevera - Electric Reign Split",
          category: "Split Posters",
          price: 399,
          priceA3: 299,
          description: "Electric hypercar Rimac Nevera split poster with lightning effects",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rn-o7XyuNd18quK1vLrcPhqOaenhfmiMy.png",
          slug: "rimac-nevera-electric-split",
          featured: false,
        },
      ]

      // Check if we have saved posters and merge with new ones
      const savedPosters = localStorage.getItem("posters")
      if (savedPosters) {
        try {
          const parsedPosters = JSON.parse(savedPosters)

          // Create a map of existing posters by ID
          const existingPostersMap = new Map(parsedPosters.map((p: Poster) => [p.id, p]))

          // Update existing posters with correct pricing and add new ones
          const updatedPosters = completePosters.map((newPoster) => {
            const existingPoster = existingPostersMap.get(newPoster.id)
            if (existingPoster) {
              // Update existing poster with correct pricing and image URL
              return {
                ...existingPoster,
                price: newPoster.price, // Keep the original pricing for each category
                priceA3: newPoster.priceA3,
                imageUrl: newPoster.imageUrl, // Ensure correct image URL
                category: newPoster.category, // Ensure correct category
                featured: newPoster.featured, // Update featured status
              }
            }
            return newPoster
          })

          // Add any additional posters that were added by admin but not in our default list
          const additionalPosters = parsedPosters
            .filter(
              (p: Poster) =>
                !completePosters.find((cp) => cp.id === p.id) && p.imageUrl && p.imageUrl !== "/placeholder.svg",
            )
            .map((p: Poster) => ({
              ...p,
              price: p.category === "Split Posters" ? 399 : 99,
              priceA3: p.category === "Split Posters" ? 299 : 149,
            }))

          const finalPosters = [...updatedPosters, ...additionalPosters]
          setPosters(finalPosters)
          localStorage.setItem("posters", JSON.stringify(finalPosters))
        } catch (err) {
          console.error("Error parsing saved posters:", err)
          setPosters(completePosters)
          localStorage.setItem("posters", JSON.stringify(completePosters))
        }
      } else {
        setPosters(completePosters)
        localStorage.setItem("posters", JSON.stringify(completePosters))
      }

      setLoading(false)
    }

    loadPosters()
  }, [])

  // Save posters to localStorage whenever they change
  useEffect(() => {
    if (!loading && posters.length > 0) {
      localStorage.setItem("posters", JSON.stringify(posters))
    }
  }, [posters, loading])

  // Add a new poster
  const addPoster = (posterData: Omit<Poster, "id" | "slug">) => {
    const id = Date.now().toString()
    const slug = generateSlug(posterData.title)

    const newPoster: Poster = {
      ...posterData,
      id,
      slug,
      price: posterData.price || (posterData.category === "Split Posters" ? 399 : 99),
      priceA3: posterData.priceA3 || (posterData.category === "Split Posters" ? 299 : 149),
    }

    console.log("Adding new poster:", newPoster)
    setPosters((prevPosters) => [...prevPosters, newPoster])
  }

  // Update an existing poster
  const updatePoster = (id: string, posterData: Partial<Poster>) => {
    setPosters((prevPosters) =>
      prevPosters.map((poster) => {
        if (poster.id === id) {
          // Update the slug if the title has changed
          let slug = poster.slug
          if (posterData.title && posterData.title !== poster.title) {
            slug = generateSlug(posterData.title)
          }

          return {
            ...poster,
            ...posterData,
            slug,
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
    // Convert category slug to proper format (e.g., "split-posters" to "Split Posters")
    const formattedCategory = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    console.log("Getting posters for category:", formattedCategory)
    console.log("Total posters:", posters.length)

    // Accept all image URLs, including blob URLs and data URLs
    const filtered = posters.filter((poster) => {
      if (!poster || !poster.category) {
        console.log("Poster missing category:", poster?.title)
        return false
      }

      // Check if the category matches (case-insensitive)
      const categoryMatch = poster.category.toLowerCase() === formattedCategory.toLowerCase()

      // For debugging
      if (categoryMatch) {
        console.log("Matched poster:", poster.title, "with image:", poster.imageUrl?.substring(0, 50))
      }

      return categoryMatch
    })

    console.log("Filtered posters count:", filtered.length)
    return filtered
  }

  // Get featured posters
  const getFeaturedPosters = () => {
    return posters.filter((poster) => {
      if (!poster) return false
      return poster.featured === true
    })
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
