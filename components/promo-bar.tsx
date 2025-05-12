"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const promos = [
  "✨ FREE DELIVERY FOR PREPAID ORDERS!",
  "BUY 4 GET 2 FREE",
  "BUY 6 GET 3 FREE",
  "BUY 8 GET 4 FREE",
]

export default function PromoBar() {
  const [currentPromo, setCurrentPromo] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev + 1) % promos.length)
  }

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev - 1 + promos.length) % promos.length)
  }

  return (
    <div className="bg-black text-white py-2 relative">
      <div className="container mx-auto flex items-center justify-center px-8">
        <button onClick={prevPromo} className="absolute left-2 text-white p-1" aria-label="Previous promotion">
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-center text-sm font-medium">{promos[currentPromo]}</div>

        <button onClick={nextPromo} className="absolute right-2 text-white p-1" aria-label="Next promotion">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
