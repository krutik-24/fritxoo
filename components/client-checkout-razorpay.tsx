"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

// Minimum order value
const MINIMUM_ORDER_VALUE = 259

// Razorpay key ID
const RAZORPAY_KEY_ID = "rzp_live_BV1EVSSIhJdOpz"

// Define the Razorpay interface
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function ClientCheckoutRazorpay() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRazorpayReady, setIsRazorpayReady] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Shipping cost calculation (free above Rs. 499)
  const shippingCost = subtotal >= 499 ? 0 : 49
  const total = subtotal + shippingCost

  // Redirect to cart if cart is empty or below minimum order value
  useEffect(() => {
    if (items.length === 0 || subtotal < MINIMUM_ORDER_VALUE) {
      router.push("/cart")
    }
  }, [items, subtotal, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required"
      }
    })

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation (10 digits)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    // Pincode validation (6 digits)
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createRazorpayOrder = async () => {
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      return data.order
    } catch (error) {
      console.error("Error creating Razorpay order:", error)
      throw error
    }
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      return
    }

    if (!isRazorpayReady) {
      alert("Razorpay is still loading. Please try again in a moment.")
      return
    }

    setIsLoading(true)

    try {
      const order = await createRazorpayOrder()

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Fritxoo",
        description: "Purchase of posters",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        },
        theme: {
          color: "#000000",
        },
        // Razorpay automatically enables all available payment methods including UPI
        handler: async (response: any) => {
          try {
            // Verify the payment
            const verificationResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verificationData = await verificationResponse.json()

            if (verificationData.success) {
              // Payment successful, clear cart and redirect to success page
              clearCart()
              router.push("/checkout/success")
            } else {
              alert("Payment verification failed. Please try again.")
              setIsLoading(false)
            }
          } catch (error) {
            console.error("Error verifying payment:", error)
            alert("An error occurred while verifying your payment. Please contact support.")
            setIsLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("An error occurred during checkout. Please try again.")
      setIsLoading(false)
    }
  }

  if (items.length === 0 || subtotal < MINIMUM_ORDER_VALUE) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setIsRazorpayReady(true)} />

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">
                        Pincode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={errors.pincode ? "border-red-500" : ""}
                      />
                      {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
                    </div>

                    <Button
                      className="w-full bg-black text-white hover:bg-gray-800"
                      onClick={handlePayment}
                      disabled={isLoading || !isRazorpayReady}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-20 bg-gray-100 rounded-md relative flex-shrink-0">
                          {item.imageData ? (
                            <img
                              src={`data:image/png;base64,${item.imageData}`}
                              alt={item.title}
                              className="object-cover rounded-md w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-500">
                            {item.size && `Size: ${item.size}`} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold mt-1">Rs. {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : `Rs. ${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between py-2 font-semibold">
                      <span>Total</span>
                      <span>Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center">
                      <img src="/placeholder.svg?height=24&width=80" alt="Razorpay" className="h-6 mr-2" />
                      <p className="text-sm text-gray-600">Secure payments powered by Razorpay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
