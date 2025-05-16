"use client"

import type React from "react"
import { CartProvider } from "@/context/cart-context"
import { TooltipProvider } from "@/components/ui/tooltip"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <CartProvider>{children}</CartProvider>
    </TooltipProvider>
  )
}
