"use client"

import type React from "react"
import { CartProvider } from "@/context/cart-context"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
