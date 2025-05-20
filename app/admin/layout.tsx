import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <Tabs defaultValue="posters" className="mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <Link href="/admin/dashboard" passHref legacyBehavior>
              <TabsTrigger value="dashboard" asChild>
                <a>Dashboard</a>
              </TabsTrigger>
            </Link>
            <Link href="/admin/posters" passHref legacyBehavior>
              <TabsTrigger value="posters" asChild>
                <a>Posters</a>
              </TabsTrigger>
            </Link>
            <Link href="/admin/settings" passHref legacyBehavior>
              <TabsTrigger value="settings" asChild>
                <a>Settings</a>
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {children}
      </div>

      <Footer />
    </div>
  )
}
