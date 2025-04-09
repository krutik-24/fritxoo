"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, User, ShoppingBag, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "./logo"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Logo />

        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black">
              Shop Posters <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-1">
                <Link href="/category/movies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Movies
                </Link>
                <Link href="/category/tv-shows" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  TV Shows
                </Link>
                <Link href="/category/music" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Music
                </Link>
                <Link href="/category/sports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sports
                </Link>
              </div>
            </div>
          </div>
          <Link href="/bulk-posters" className="text-sm font-medium text-gray-700 hover:text-black">
            Bulk Posters
          </Link>
          <Link href="/custom-posters" className="text-sm font-medium text-gray-700 hover:text-black">
            Custom Posters
          </Link>
          <Link href="/wall-collage" className="text-sm font-medium text-gray-700 hover:text-black">
            Wall Collage Kit
          </Link>
          <Link href="/split-posters" className="text-sm font-medium text-gray-700 hover:text-black">
            Split Posters
          </Link>
          <Link href="/reviews" className="text-sm font-medium text-gray-700 hover:text-black">
            Reviews
          </Link>
          <Link href="/how-to-avail-offer" className="text-sm font-medium text-gray-700 hover:text-black">
            How To Avail Offer
          </Link>
          <Link href="/support" className="text-sm font-medium text-gray-700 hover:text-black">
            Support
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-8 h-9 w-full rounded-md border border-gray-300" />
          </div>
          <Button variant="ghost" size="icon" className="text-gray-700">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-700">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-white">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-8 h-9 w-full rounded-md border border-gray-300" />
          </div>
          <nav className="flex flex-col space-y-4">
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-black">
              Shop Posters
            </Link>
            <Link href="/bulk-posters" className="text-sm font-medium text-gray-700 hover:text-black">
              Bulk Posters
            </Link>
            <Link href="/custom-posters" className="text-sm font-medium text-gray-700 hover:text-black">
              Custom Posters
            </Link>
            <Link href="/wall-collage" className="text-sm font-medium text-gray-700 hover:text-black">
              Wall Collage Kit
            </Link>
            <Link href="/split-posters" className="text-sm font-medium text-gray-700 hover:text-black">
              Split Posters
            </Link>
            <Link href="/reviews" className="text-sm font-medium text-gray-700 hover:text-black">
              Reviews
            </Link>
            <Link href="/how-to-avail-offer" className="text-sm font-medium text-gray-700 hover:text-black">
              How To Avail Offer
            </Link>
            <Link href="/support" className="text-sm font-medium text-gray-700 hover:text-black">
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
