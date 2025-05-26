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
}

// Define the context type
interface PosterContextType {
  posters: Poster[]
  addPoster: (poster: Omit<Poster, "id" | "slug">) => void
  updatePoster: (id: string, poster: Partial<Poster>) => void
  deletePoster: (id: string) => void
  getPostersByCategory: (category: string) => Poster[]
  getPosterById: (id: string) => Poster | undefined
  loading: boolean
}

// Create the context
const PosterContext = createContext<PosterContextType | undefined>(undefined)

// Provider component
export function PosterProvider({ children }: { children: ReactNode }) {
  const [posters, setPosters] = useState<Poster[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize with all car posters
  useEffect(() => {
    const loadPosters = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Always reset to the complete poster collection to ensure consistency
      const completeCarPosters = [
        {
          id: "1",
          title: "Ferrari 250 GTO",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Classic Ferrari 250 GTO sports car",
          imageUrl: "/images/ferrari-250-gto.png",
          slug: "ferrari-250-gto",
        },
        {
          id: "2",
          title: "1984 Audi Sport Quattro",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Iconic 1984 Audi Sport Quattro rally car",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audi.jpg-yCWRGWaZF7TBITD9awP7MDRDUNdqD9.jpeg",
          slug: "audi-sport-quattro",
        },
        {
          id: "3",
          title: "1999 Nissan Skyline GT-R R34",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Legendary 1999 Nissan Skyline GT-R R34 sports car",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/skyline%20gtr-LzO6YsF9uky63dV5JcyCrpVE4EQayW.png",
          slug: "nissan-skyline-gtr-r34",
        },
        {
          id: "4",
          title: "Ferrari F40 - Unleash The Legend",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Ferrari F40 supercar with performance specifications",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f40-ZN0pg4Nt3WLOMi5IVbfT7IqR63FMKG.png",
          slug: "ferrari-f40-unleash-legend",
        },
        {
          id: "5",
          title: "Bugatti Chiron - Engineered For Gods",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Bugatti Chiron hypercar in cyberpunk setting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chiron-ES4dcM11iPyaJjT9bdPcmnVUJMF5q0.png",
          slug: "bugatti-chiron-engineered-gods",
        },
        {
          id: "6",
          title: "Aston Martin DBS - Master The Machine",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Aston Martin DBS grand tourer",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dbs-7d4e0T86gDejDDqYLqr19mFDaGRiEl.png",
          slug: "aston-martin-dbs-master-machine",
        },
        {
          id: "7",
          title: "Lamborghini Aventador - Unleash The Rage",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Lamborghini Aventador supercar with dramatic lighting",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aventedor-lSaXHHYAO1bIVQobghVl2exRf9lpWI.png",
          slug: "lamborghini-aventador-unleash-rage",
        },
        {
          id: "8",
          title: "Toyota Century - Timeless Regal",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Toyota Century luxury sedan in nighttime setting",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/century-jNhFbPZWuq9X3wQrT9ecxSFiUSOzg7.png",
          slug: "toyota-century-timeless-regal",
        },
        {
          id: "9",
          title: "1961 Jaguar E-Type Series 1",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Classic 1961 Jaguar E-Type Series 1 sports car",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jaguar-epMkvmwhu5Rva5zfSIYTMUFHyodeSo.png",
          slug: "jaguar-e-type-series-1",
        },
        {
          id: "10",
          title: "The Last Breath of Fire",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Ferrari with dramatic fire effects and red lighting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fire-c5vNAHhVZDJywPXaN8Fe0kbGcgDoAB.png",
          slug: "last-breath-fire",
        },
        {
          id: "11",
          title: "Hellcat - Dominate The Streets",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Dodge Challenger Hellcat muscle car",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hell%20cat-yRJa8R9n9qIyHETBhkJKh4NqtDOdqN.png",
          slug: "hellcat-dominate-streets",
        },
        {
          id: "12",
          title: "Unleash The Hemi Power",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Dodge Challenger with Hemi engine power",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hell%20cat2-zVVy2fyLkrT4haivvQIdRWbel5oVg9.png",
          slug: "unleash-hemi-power",
        },
        {
          id: "13",
          title: "1963 Ferrari 250 GTO",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Classic 1963 Ferrari 250 GTO racing legend",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ferrari-hRveuEHk6KdgPC6G7yhnPY7z810KXn.png",
          slug: "ferrari-250-gto-1963",
        },
        {
          id: "14",
          title: "Porsche Turbo S - Where Elegance Meets Velocity",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Porsche 911 Turbo S on mountain roads with dramatic lighting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/porche-LXNOkw4tWeCj0NV7E80ahQsE123bST.png",
          slug: "porsche-turbo-s-elegance-velocity",
        },
        {
          id: "15",
          title: "Rage of Retro - Lamborghini Countach",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Retro synthwave Lamborghini Countach poster with 80s aesthetic",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lambo-GFUUouynIi1HvvbF10S7ZwHXWC9ZCm.png",
          slug: "rage-retro-lamborghini-countach",
        },
        {
          id: "16",
          title: "Godzilla - The Beast From The East",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Nissan Skyline GT-R R34 in cyberpunk setting",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r34-cES6uiUWHm3piAAZKSuOjswkucEauP.png",
          slug: "godzilla-beast-east-r34",
        },
        {
          id: "17",
          title: "1970 Ford Mustang Boss 302",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Classic 1970 Ford Mustang Boss 302 in minimalist design",
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mustang-LmDaskP6cWgV0rkeP43Jhd5OMqFgTq.png",
          slug: "ford-mustang-boss-302-1970",
        },
        {
          id: "18",
          title: "Skyline GT-R R32 - Cherry Blossom",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Nissan Skyline GT-R R32 under cherry blossom tree",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r32-jCt4k0ZXAB2Cxeqx83LxkrR4ueU3c4.png",
          slug: "skyline-gtr-r32-cherry-blossom",
        },
        {
          id: "19",
          title: "Legend Reborn - Toyota Supra",
          category: "Cars",
          price: 99,
          priceA3: 150,
          description: "Toyota Supra in cyberpunk cityscape - Built for the street, born to dominate",
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supra-PDeR5Kc4OYt6BR8lrlCC4NtUmkBnMq.png",
          slug: "legend-reborn-toyota-supra",
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
          const updatedPosters = completeCarPosters.map((newPoster) => {
            const existingPoster = existingPostersMap.get(newPoster.id)
            if (existingPoster) {
              // Update existing poster with correct pricing and image URL
              return {
                ...existingPoster,
                price: 99,
                priceA3: 150,
                imageUrl: newPoster.imageUrl, // Ensure correct image URL
                category: "Cars", // Ensure correct category
              }
            }
            return newPoster
          })

          // Add any additional posters that were added by admin but not in our default list
          const additionalPosters = parsedPosters
            .filter(
              (p: Poster) =>
                !completeCarPosters.find((cp) => cp.id === p.id) &&
                p.category.toLowerCase() === "cars" &&
                p.imageUrl &&
                p.imageUrl !== "/placeholder.svg",
            )
            .map((p: Poster) => ({
              ...p,
              price: 99,
              priceA3: 150,
            }))

          const finalPosters = [...updatedPosters, ...additionalPosters]
          setPosters(finalPosters)
          localStorage.setItem("posters", JSON.stringify(finalPosters))
        } catch (error) {
          console.error("Error parsing saved posters:", error)
          setPosters(completeCarPosters)
          localStorage.setItem("posters", JSON.stringify(completeCarPosters))
        }
      } else {
        setPosters(completeCarPosters)
        localStorage.setItem("posters", JSON.stringify(completeCarPosters))
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
      price: posterData.price || 99,
      priceA3: posterData.priceA3 || 150,
    }

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
    // Convert category slug to proper format (e.g., "cars" to "Cars")
    const formattedCategory = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return posters.filter((poster) => {
      if (!poster || !poster.category || !poster.imageUrl) return false
      // Filter out placeholder images
      if (poster.imageUrl === "/placeholder.svg") return false
      return poster.category.toLowerCase() === formattedCategory.toLowerCase()
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
