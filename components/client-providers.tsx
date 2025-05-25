"use client"

import type React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
