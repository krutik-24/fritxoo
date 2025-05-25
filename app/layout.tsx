import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/context/cart-context"
import { PosterProvider } from "@/context/poster-context"
import { AnalyticsProvider } from "@/context/analytics-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Poster Gallery - Premium Posters & Wall Art",
  description: "Discover amazing posters and wall art for your space",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AnalyticsProvider>
            <PosterProvider>
              <CartProvider>
                <Suspense fallback={null}>
                  {children}
                  <Toaster />
                </Suspense>
              </CartProvider>
            </PosterProvider>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
