"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, User, ShoppingBag, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "./logo"
import { useCart } from "@/context/cart-context"
import { usePosters } from "@/context/poster-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  // Add these new state variables and logic:
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const { posters } = usePosters()
  const searchRef = useRef<HTMLDivElement>(null)

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const filteredPosters = posters.filter(
      (poster) =>
        poster.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poster.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poster.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(filteredPosters.slice(0, 6)) // Limit to 6 results
    setShowResults(true)
  }, [searchQuery, posters])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && searchResults.length > 0) {
      // Navigate to first result or search results page
      window.location.href = `/products/${searchResults[0].slug}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Logo />

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/split-posters" className="text-sm font-medium text-gray-700 hover:text-black">
            Split Posters
          </Link>
          <div className="relative group">
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black">
              Shop Posters <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-1">
                <Link href="/category/cars" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cars
                </Link>
                <Link href="/category/anime" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Anime
                </Link>
                <Link href="/category/collage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Collage
                </Link>
                <Link href="/category/movies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Movies
                </Link>
                <Link href="/category/sports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sports
                </Link>
              </div>
            </div>
          </div>
          <Link href="/custom-posters" className="text-sm font-medium text-gray-700 hover:text-black">
            Custom Posters
          </Link>
          <Link href="/admin-login" className="text-sm font-medium text-gray-700 hover:text-black">
            Admin
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block w-64" ref={searchRef}>
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <form onSubmit={handleSearchSubmit}>
              <Input
                placeholder="Search posters..."
                className="pl-8 h-9 w-full rounded-md border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
              />
            </form>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((poster) => (
                  <Link
                    key={poster.id}
                    href={`/products/${poster.slug}`}
                    className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setShowResults(false)
                      setSearchQuery("")
                    }}
                  >
                    <div className="w-12 h-12 mr-3 flex-shrink-0">
                      <img
                        src={poster.imageUrl || "/placeholder.svg"}
                        alt={poster.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=48&width=48&text=${encodeURIComponent(poster.title.slice(0, 2))}`
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{poster.title}</p>
                      <p className="text-xs text-gray-500">{poster.category}</p>
                      <p className="text-xs font-semibold text-green-600">₹{poster.price}</p>
                    </div>
                  </Link>
                ))}
                {searchQuery && searchResults.length === 0 && (
                  <div className="p-3 text-center text-gray-500 text-sm">No posters found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-gray-700">
            <User className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-gray-700 relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
          <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-white">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posters..."
              className="pl-8 h-9 w-full rounded-md border border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <nav className="flex flex-col space-y-4">
            <Link href="/split-posters" className="text-sm font-medium text-gray-700 hover:text-black">
              Split Posters
            </Link>
            <Link href="/category/cars" className="text-sm font-medium text-gray-700 hover:text-black">
              Cars
            </Link>
            <Link href="/category/anime" className="text-sm font-medium text-gray-700 hover:text-black">
              Anime
            </Link>
            <Link href="/category/collage" className="text-sm font-medium text-gray-700 hover:text-black">
              Collage
            </Link>
            <Link href="/category/movies" className="text-sm font-medium text-gray-700 hover:text-black">
              Movies
            </Link>
            <Link href="/custom-posters" className="text-sm font-medium text-gray-700 hover:text-black">
              Custom Posters
            </Link>
            <Link href="/admin-login" className="text-sm font-medium text-gray-700 hover:text-black">
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
