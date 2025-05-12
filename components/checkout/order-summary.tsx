"use client"

import { useCart } from "@/context/cart-context"
import Image from "next/image"

interface OrderSummaryProps {
  shippingInfo?: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    pincode: string
  }
}

export default function OrderSummary({ shippingInfo }: OrderSummaryProps) {
  const { items, subtotal } = useCart()

  // Shipping cost calculation (free above Rs. 499)
  const shippingCost = subtotal >= 499 ? 0 : 49
  const total = subtotal + shippingCost

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-20 bg-gray-100 rounded-md relative flex-shrink-0">
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
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">
                  {item.size && `Size: ${item.size}`} • Qty: {item.quantity}
                </p>
                <p className="text-sm font-semibold mt-1">Rs. {item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {shippingInfo && (
          <div className="border-t pt-4 mb-6">
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {shippingInfo.firstName} {shippingInfo.lastName}
              <br />
              {shippingInfo.address}
              <br />
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}
            </p>
          </div>
        )}

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
      </div>
    </div>
  )
}
