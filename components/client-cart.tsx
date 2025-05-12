"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"

export default function ClientCart() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const router = useRouter()

  // Minimum order value
  const MINIMUM_ORDER_VALUE = 259

  // Shipping cost calculation (free above Rs. 499)
  const shippingCost = subtotal >= 499 ? 0 : 49
  const total = subtotal + shippingCost

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
                    {items.map((item) => (
                      <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-36 bg-gray-100 rounded-md relative flex-shrink-0">
                          {item.imageData ? (
                            <Image
                              src={`data:image/png;base64,${item.imageData}`}
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <Image
                              src="/placeholder.svg?height=600&width=400"
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          )}
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-gray-500">{item.category}</p>
                              {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                            </div>
                            <p className="font-semibold">Rs. {item.price}</p>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : `Rs. ${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>Rs. {total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {shippingCost === 0
                          ? "Free shipping applied"
                          : `Add Rs. ${(499 - subtotal).toFixed(2)} more for free shipping`}
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
                          Minimum order value is Rs. {MINIMUM_ORDER_VALUE}. Please add Rs.{" "}
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
