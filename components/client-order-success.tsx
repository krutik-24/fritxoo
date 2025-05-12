"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package } from "lucide-react"
import Link from "next/link"

export default function ClientOrderSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string>(`FRIT${Math.floor(Math.random() * 1000000)}`)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  // Get payment details from URL if available
  useEffect(() => {
    const paymentId = searchParams.get("razorpay_payment_id")
    const orderId = searchParams.get("razorpay_order_id")

    if (paymentId) {
      setPaymentId(paymentId)
    }

    if (orderId) {
      setOrderId(orderId)
    }

    // Set a flag in session storage to indicate a completed checkout
    sessionStorage.setItem("hasCompletedCheckout", "true")
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-sm text-gray-500">Order Reference</p>
                <p className="text-lg font-semibold">{orderId}</p>
                {paymentId && (
                  <>
                    <p className="text-sm text-gray-500 mt-2">Payment ID</p>
                    <p className="text-sm font-medium">{paymentId}</p>
                  </>
                )}
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-600">You will receive an email confirmation shortly.</p>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/shop">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">Continue Shopping</Button>
                </Link>

                <Link href={`/orders/${orderId}`}>
                  <Button variant="outline" className="w-full">
                    View Order Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
