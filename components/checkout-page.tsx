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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, CreditCard, Smartphone, AlertCircle, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Script from "next/script"
import Image from "next/image"

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

// List of Indian states
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

// Enhanced Image Component for Cart Items
const CartItemImage = ({ item }: { item: any }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setImageError(false)
    setImageLoaded(false)
  }, [item.id])

  const handleImageLoad = () => {
    setImageLoaded(true)
    setIsLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
    setImageLoaded(false)
    console.warn(`Failed to load image for item: ${item.title}`)
  }

  // Determine image source
  const getImageSrc = () => {
    if (item.imageData) {
      return `data:image/png;base64,${item.imageData}`
    }
    if (item.imageUrl) {
      return item.imageUrl
    }
    return null
  }

  const imageSrc = getImageSrc()

  return (
    <div className="w-16 h-20 bg-gray-100 rounded-md relative flex-shrink-0 overflow-hidden">
      {imageSrc ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={item.title || "Product image"}
            fill
            className={`object-cover rounded-md transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={true}
            crossOrigin="anonymous"
          />
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
              <ImageIcon className="h-4 w-4 mb-1" />
              <span className="text-xs font-medium">{item.title?.slice(0, 8) || "Item"}</span>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
          <ImageIcon className="h-4 w-4 mb-1" />
          <span className="text-xs font-medium text-center leading-tight">{item.title?.slice(0, 8) || "No Image"}</span>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRazorpayReady, setIsRazorpayReady] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<string>("upi")
  const [saveInfo, setSaveInfo] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
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

  // Load saved customer info from localStorage if available
  useEffect(() => {
    const savedInfo = localStorage.getItem("customerInfo")
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo)
        setFormData((prev) => ({
          ...prev,
          ...parsedInfo,
        }))
        setSaveInfo(true)
      } catch (error) {
        console.error("Error parsing saved customer info:", error)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }))

    // Clear error when field is edited
    if (errors.state) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.state
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"]

    // Required fields
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = "This field is required"
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
            shippingAddress: `${formData.address}${formData.apartment ? ", " + formData.apartment : ""}, ${
              formData.city
            }, ${formData.state}, ${formData.pincode}`,
            orderNotes: formData.notes || "No special instructions",
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const data = await response.json()
      return data.order
    } catch (error) {
      console.error("Error creating Razorpay order:", error)
      throw error
    }
  }

  const handlePayment = async () => {
    setFormError(null)

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    if (!isRazorpayReady) {
      setFormError("Payment gateway is still loading. Please try again in a moment.")
      return
    }

    if (scriptError) {
      setFormError("Failed to load payment gateway. Please refresh the page and try again.")
      return
    }

    // Save customer info if checkbox is checked
    if (saveInfo) {
      localStorage.setItem("customerInfo", JSON.stringify(formData))
    } else {
      localStorage.removeItem("customerInfo")
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
          address: `${formData.address}${formData.apartment ? ", " + formData.apartment : ""}, ${formData.city}, ${
            formData.state
          }, ${formData.pincode}`,
          orderNotes: formData.notes || "No special instructions",
        },
        theme: {
          color: "#000000",
        },
        // Set preferred payment method if specified
        config: {
          display: {
            default_method: preferredPaymentMethod,
          },
        },
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
                customer_details: {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  address: `${formData.address}${formData.apartment ? ", " + formData.apartment : ""}, ${
                    formData.city
                  }, ${formData.state}, ${formData.pincode}`,
                  notes: formData.notes,
                },
              }),
            })

            const verificationData = await verificationResponse.json()

            if (verificationData.success) {
              // Payment successful, clear cart and redirect to success page with order details
              clearCart()
              router.push(
                `/checkout/success?razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}`,
              )
            } else {
              setFormError("Payment verification failed. Please try again or contact support.")
              setIsLoading(false)
            }
          } catch (error) {
            console.error("Error verifying payment:", error)
            setFormError("An error occurred while verifying your payment. Please contact support.")
            setIsLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setFormError("Payment cancelled. Your cart items are still saved.")
            setIsLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on("payment.failed", (response: any) => {
        setFormError(`Payment failed: ${response.error.description}`)
        setIsLoading(false)
      })
      razorpay.open()
    } catch (error) {
      console.error("Error during checkout:", error)
      setFormError("An error occurred during checkout. Please try again.")
      setIsLoading(false)
    }
  }

  if (items.length === 0 || subtotal < MINIMUM_ORDER_VALUE) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayReady(true)}
        onError={() => {
          setScriptError(true)
          setFormError("Failed to load payment gateway. Please refresh the page and try again.")
        }}
      />

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

          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                      <div className="space-y-4">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                      <div className="space-y-4">
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
                            placeholder="Street address, house number"
                          />
                          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                          <Input
                            id="apartment"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                            placeholder="Apartment, suite, unit, building, floor, etc."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                            <Select value={formData.state} onValueChange={handleStateChange}>
                              <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {INDIAN_STATES.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Order notes (optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Special instructions for delivery or any other notes"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Payment Method Preference */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Preference</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="upi"
                            name="paymentMethod"
                            value="upi"
                            checked={preferredPaymentMethod === "upi"}
                            onChange={() => setPreferredPaymentMethod("upi")}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="upi" className="flex items-center cursor-pointer">
                            <Smartphone className="h-4 w-4 mr-2" />
                            UPI Payment (Google Pay, PhonePe, Paytm)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="card"
                            name="paymentMethod"
                            value="card"
                            checked={preferredPaymentMethod === "card"}
                            onChange={() => setPreferredPaymentMethod("card")}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="card" className="flex items-center cursor-pointer">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Credit/Debit Card
                          </Label>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        This sets your preferred payment method. You can still choose other methods during payment.
                      </p>
                    </div>

                    {/* Save Information */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveInfo"
                        checked={saveInfo}
                        onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                      />
                      <Label htmlFor="saveInfo" className="text-sm">
                        Save my information for faster checkout next time
                      </Label>
                    </div>

                    <Button
                      className="w-full bg-black text-white hover:bg-gray-800"
                      onClick={handlePayment}
                      disabled={isLoading}
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

                    <p className="text-xs text-gray-500 text-center">
                      By proceeding, you agree to our Terms of Service and Privacy Policy. Your payment information is
                      processed securely by Razorpay.
                    </p>
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
                        <CartItemImage item={item} />
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
