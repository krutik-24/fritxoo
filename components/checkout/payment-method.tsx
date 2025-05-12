"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Landmark, Smartphone } from "lucide-react"
import Image from "next/image"

interface PaymentMethodProps {
  selectedMethod: string | null
  onSelect: (method: string) => void
  onBack: () => void
  onPlaceOrder: () => void
  isLoading: boolean
}

export default function PaymentMethod({
  selectedMethod,
  onSelect,
  onBack,
  onPlaceOrder,
  isLoading,
}: PaymentMethodProps) {
  const [error, setError] = useState<string | null>(null)

  const handlePlaceOrder = () => {
    if (!selectedMethod) {
      setError("Please select a payment method")
      return
    }

    setError(null)
    onPlaceOrder()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

        <RadioGroup value={selectedMethod || ""} onValueChange={onSelect} className="space-y-4">
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === "upi" ? "border-black bg-gray-50" : "border-gray-200"
            }`}
          >
            <div className="flex items-start">
              <RadioGroupItem value="upi" id="upi" className="mt-1" />
              <div className="ml-3 flex-grow">
                <Label htmlFor="upi" className="font-medium flex items-center cursor-pointer">
                  <Smartphone className="h-5 w-5 mr-2" />
                  UPI Payment
                </Label>
                <p className="text-sm text-gray-500 mt-1">Pay using UPI apps like Google Pay, PhonePe, Paytm, etc.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="Google Pay" width={24} height={24} />
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="PhonePe" width={24} height={24} />
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="Paytm" width={24} height={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === "card" ? "border-black bg-gray-50" : "border-gray-200"
            }`}
          >
            <div className="flex items-start">
              <RadioGroupItem value="card" id="card" className="mt-1" />
              <div className="ml-3 flex-grow">
                <Label htmlFor="card" className="font-medium flex items-center cursor-pointer">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Credit / Debit Card
                </Label>
                <p className="text-sm text-gray-500 mt-1">Pay using Visa, Mastercard, RuPay, or American Express</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="Visa" width={24} height={24} />
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="Mastercard" width={24} height={24} />
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="RuPay" width={24} height={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === "netbanking" ? "border-black bg-gray-50" : "border-gray-200"
            }`}
          >
            <div className="flex items-start">
              <RadioGroupItem value="netbanking" id="netbanking" className="mt-1" />
              <div className="ml-3 flex-grow">
                <Label htmlFor="netbanking" className="font-medium flex items-center cursor-pointer">
                  <Landmark className="h-5 w-5 mr-2" />
                  Net Banking
                </Label>
                <p className="text-sm text-gray-500 mt-1">Pay using your bank account through net banking</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="SBI" width={24} height={24} />
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="HDFC" width={24} height={24} />
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Image src="/placeholder.svg?height=24&width=24" alt="ICICI" width={24} height={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Shipping
          </Button>
          <Button
            className="flex-1 bg-black text-white hover:bg-gray-800"
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
