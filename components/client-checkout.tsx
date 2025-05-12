"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CheckoutSteps from "@/components/checkout/checkout-steps"
import ShippingForm from "@/components/checkout/shipping-form"
import PaymentMethod from "@/components/checkout/payment-method"
import OrderSummary from "@/components/checkout/order-summary"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Minimum order value
const MINIMUM_ORDER_VALUE = 259

export default function ClientCheckout() {
  const { items, subtotal } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to cart if cart is empty or below minimum order value
  useEffect(() => {
    if (items.length === 0 || subtotal < MINIMUM_ORDER_VALUE) {
      router.push("/cart")
    }
  }, [items, subtotal, router])

  const handleShippingSubmit = (data: typeof shippingInfo) => {
    setShippingInfo(data)
    setCurrentStep(2)
    window.scrollTo(0, 0)
  }

  const handlePaymentSelect = (method: string) => {
    setPaymentMethod(method)
  }

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return

    setIsLoading(true)

    try {
      // In a real app, you would send the order to your backend
      // and handle payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If payment method is UPI, redirect to UPI payment page
      if (paymentMethod === "upi") {
        router.push("/checkout/upi-payment")
      } else {
        // For other payment methods, redirect to order confirmation
        router.push("/checkout/success")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      setIsLoading(false)
    }
  }

  if (items.length === 0 || subtotal < MINIMUM_ORDER_VALUE) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Checkout</h1>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/cart">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600">
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Button>
            </Link>
          </div>

          <CheckoutSteps currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              {currentStep === 1 ? (
                <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingInfo} />
              ) : (
                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onSelect={handlePaymentSelect}
                  onBack={() => setCurrentStep(1)}
                  onPlaceOrder={handlePlaceOrder}
                  isLoading={isLoading}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <OrderSummary shippingInfo={currentStep > 1 ? shippingInfo : undefined} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
