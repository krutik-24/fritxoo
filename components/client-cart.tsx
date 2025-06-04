"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"

// Minimum order value
const MINIMUM_ORDER_VALUE = 259

export default function ClientCart() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({})
  const router = useRouter()

  // Shipping cost calculation (free above Rs. 499)
  const shippingCost = subtotal >= 499 ? 0 : 49
  const total = subtotal + shippingCost

  const handleImageLoad = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }))
  }

  const handleImageError = (id: string) => {
    setErrorImages((prev) => ({ ...prev, [id]: true }))
    setLoadingImages((prev) => ({ ...prev, [id]: false }))
  }

  const handleApplyCoupon = () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code")
      return
    }

    // In a real app, you would validate the coupon with your backend
    setCouponError("Invalid or expired coupon code")
  }

  const handleCheckout = () => {
    if (subtotal < MINIMUM_ORDER_VALUE) {
      return
    }

    // Redirect to the checkout page
    router.push("/checkout")
  }

  // Helper function to get correct price display
  const getItemPriceDisplay = (item: any) => {
    // Check if the item has the correct price based on size and category
    const isCorrectPrice = () => {
      if (item.category === "Split Posters") {
        return (item.size === "A4" && item.price === 299) || (item.size === "A3" && item.price === 399)
      } else {
        return (item.size === "A4" && item.price === 99) || (item.size === "A3" && item.price === 149)
      }
    }

    return isCorrectPrice() ? (
      <p className="font-semibold">₹{item.price}</p>
    ) : (
      <div>
        <p className="font-semibold">₹{item.price}</p>
        <p className="text-xs text-red-500">Price may be outdated</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="bg-gray-100 rounded-full p-6 inline-block mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any posters to your cart yet. Start shopping to add some amazing posters to
              your collection!
            </p>
            <Link href="/shop">
              <Button className="bg-black text-white hover:bg-gray-800">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Your Cart</h1>
          <p className="text-center mt-2 text-gray-300">{itemCount} items in your cart</p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                  <div className="divide-y">
                    {items.map((item) => {
                      // Set loading state for this image when component first renders
                      if (loadingImages[item.id] === undefined && item.imageUrl) {
                        setLoadingImages((prev) => ({ ...prev, [item.id]: true }))
                      }

                      return (
                        <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6">
                          {/* Poster Image Preview */}
                          <div className="w-full sm:w-32 h-40 bg-gray-100 rounded-md relative flex-shrink-0 overflow-hidden">
                            {item.imageUrl && !errorImages[item.id] ? (
                              <>
                                <Image
                                  src={item.imageUrl || "/placeholder.svg"}
                                  alt={item.title}
                                  fill
                                  className={`object-cover rounded-md transition-opacity duration-300 ${
                                    loadingImages[item.id] ? "opacity-0" : "opacity-100"
                                  }`}
                                  onLoad={() => handleImageLoad(item.id)}
                                  onError={() => handleImageError(item.id)}
                                  sizes="(max-width: 768px) 100vw, 128px"
                                  unoptimized={item.imageUrl.startsWith("data:") || item.imageUrl.includes("blob")}
                                />
                                {loadingImages[item.id] && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className="text-gray-400 text-sm text-center p-2">
                                  <ShoppingBag className="h-6 w-6 mx-auto mb-1" />
                                  <span>{item.title}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                              </div>
                              {getItemPriceDisplay(item)}
                            </div>

                            <div className="flex justify-between items-center mt-6">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  {/* Visual summary of cart items */}
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex flex-wrap gap-2">
                      {items.slice(0, 5).map((item) => (
                        <div
                          key={`thumb-${item.id}`}
                          className="relative w-12 h-16 bg-gray-100 rounded overflow-hidden"
                        >
                          {item.imageUrl && !errorImages[item.id] ? (
                            <Image
                              src={item.imageUrl || "/placeholder.svg"}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized={item.imageUrl.startsWith("data:") || item.imageUrl.includes("blob")}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ShoppingBag className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {items.length > 5 && (
                        <div className="relative w-12 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500">+{items.length - 5}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {shippingCost === 0
                          ? "Free shipping applied"
                          : `Add ₹${(499 - subtotal).toFixed(2)} more for free shipping`}
                      </p>
                    </div>

                    <div className="pt-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={handleApplyCoupon}>
                          Apply
                        </Button>
                      </div>
                      {couponError && <p className="text-sm text-red-500 mt-1">{couponError}</p>}
                    </div>

                    {subtotal < MINIMUM_ORDER_VALUE && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Minimum order value is ₹{MINIMUM_ORDER_VALUE}. Please add ₹{" "}
                          {(MINIMUM_ORDER_VALUE - subtotal).toFixed(2)} more to proceed.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      className="w-full bg-black text-white hover:bg-gray-800 mt-4"
                      disabled={subtotal < MINIMUM_ORDER_VALUE}
                      onClick={handleCheckout}
                    >
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center">
                      <Link href="/shop" className="text-sm text-gray-600 hover:underline">
                        Continue Shopping
                      </Link>
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
