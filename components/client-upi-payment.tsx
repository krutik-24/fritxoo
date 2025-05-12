"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Copy, CheckCircle, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Minimum order value
const MINIMUM_ORDER_VALUE = 259

export default function ClientUPIPayment() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const [paymentTab, setPaymentTab] = useState("qr")
  const [upiId, setUpiId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock UPI ID for demonstration
  const merchantUpiId = "9908659046@pthdfc"

  // Mock transaction reference
  const transactionRef = `FRIT${Math.floor(Math.random() * 1000000)}`

  // Redirect to cart if cart is empty or below minimum order value
  useEffect(() => {
    if (items.length === 0 || subtotal < MINIMUM_ORDER_VALUE) {
      router.push("/cart")
    }
  }, [items, subtotal, router])

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(merchantUpiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyPayment = () => {
    if (!upiId) {
      setError("Please enter your UPI ID")
      return
    }

    setError(null)
    setIsVerifying(true)

    // Simulate payment verification
    setTimeout(() => {
      setIsVerifying(false)
      clearCart()
      router.push("/checkout/success")
    }, 2000)
  }

  if (items.length === 0 || subtotal < MINIMUM_ORDER_VALUE) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">UPI Payment</h1>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">Complete Your Payment</h2>
                <p className="text-gray-500 text-sm mt-1">Amount: Rs. {subtotal.toFixed(2)}</p>
                <p className="text-gray-500 text-sm">Reference: {transactionRef}</p>
              </div>

              <Tabs defaultValue="qr" value={paymentTab} onValueChange={setPaymentTab}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="qr">Scan QR Code</TabsTrigger>
                  <TabsTrigger value="id">Enter UPI ID</TabsTrigger>
                </TabsList>

                <TabsContent value="qr" className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image src="/placeholder.svg?height=200&width=200" alt="UPI QR Code" width={200} height={200} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-grow">
                      <p className="text-sm font-medium">UPI ID: {merchantUpiId}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyUpiId}
                      className="text-gray-500 hover:text-black"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Scan the QR code using any UPI app</p>
                    <div className="flex justify-center gap-3 mt-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Image src="/placeholder.svg?height=24&width=24" alt="Google Pay" width={24} height={24} />
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Image src="/placeholder.svg?height=24&width=24" alt="PhonePe" width={24} height={24} />
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Image src="/placeholder.svg?height=24&width=24" alt="Paytm" width={24} height={24} />
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Image src="/placeholder.svg?height=24&width=24" alt="BHIM" width={24} height={24} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="id" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">Your UPI ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="upi-id"
                        placeholder="e.g. yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <Button
                        className="bg-black text-white hover:bg-gray-800 whitespace-nowrap"
                        onClick={handleVerifyPayment}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </Button>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start">
                      <Smartphone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium">How to pay using UPI ID</p>
                        <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
                          <li>Open your UPI app (Google Pay, PhonePe, etc.)</li>
                          <li>Select "Pay to UPI ID" or similar option</li>
                          <li>
                            Enter merchant UPI ID: <span className="font-medium">{merchantUpiId}</span>
                          </li>
                          <li>
                            Enter amount: <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                          </li>
                          <li>Complete the payment in your UPI app</li>
                          <li>Enter your UPI ID above and click "Pay Now"</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-500 mb-4">After completing payment, click the button below</p>
                <Button
                  className="bg-black text-white hover:bg-gray-800 w-full"
                  onClick={handleVerifyPayment}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Payment...
                    </>
                  ) : (
                    "I've Completed Payment"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto mt-6 text-center">
            <Link href="/cart">
              <Button variant="ghost" className="text-gray-500">
                Cancel and return to cart
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
