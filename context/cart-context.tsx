"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  title: string
  price: number
  category: string
  imageUrl?: string
  quantity: number
  size?: string
  imageData?: string // For base64 encoded images
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("poster-cart")
      if (savedCart) {
        // Parse the cart and validate/fix any pricing issues
        const parsedCart = JSON.parse(savedCart)
        const validatedCart = parsedCart.map((item: CartItem) => {
          // Special price validation for Straw Hat Pirates Collage
          if (item.title.includes("Straw Hat Pirates") || item.category === "Collage") {
            const correctPrice = item.size === "A3" ? 999 : 699
            if (item.price !== correctPrice) {
              return { ...item, price: correctPrice }
            }
          }

          // Ensure correct pricing based on category and size
          if (item.category === "Split Posters") {
            if (item.size === "A4" && item.price !== 299) {
              return { ...item, price: 299 }
            } else if (item.size === "A3" && item.price !== 399) {
              return { ...item, price: 399 }
            }
          } else if (item.category !== "Collage") {
            if (item.size === "A4" && item.price !== 99) {
              return { ...item, price: 99 }
            } else if (item.size === "A3" && item.price !== 149) {
              return { ...item, price: 149 }
            }
          }

          // Filter out any items with blob URLs that might cause issues
          if (item.imageUrl && item.imageUrl.startsWith("blob:")) {
            return {
              ...item,
              imageUrl: `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(item.title)}`,
            }
          }

          return item
        })

        setItems(validatedCart)
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
      // If there's an error, clear the cart to prevent further issues
      localStorage.removeItem("poster-cart")
    }
  }, [])

  // Save cart to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem("poster-cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart:", error)
    }
  }, [items])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    // Ensure correct pricing based on category and size
    let price = newItem.price
    if (newItem.category === "Split Posters") {
      price = newItem.size === "A3" ? 399 : 299
    } else if (newItem.category === "Collage" || newItem.title.includes("Straw Hat Pirates")) {
      // Special override for Straw Hat Pirates Collage
      price = newItem.size === "A3" ? 999 : 699
    } else {
      price = newItem.size === "A3" ? 149 : 99
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id)

      if (existingItem) {
        return prevItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevItems, { ...newItem, price, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
