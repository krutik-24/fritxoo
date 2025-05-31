"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"

interface ProductActionsProps {
  id: string
  title: string
  price: number
  priceA3: number
  category: string
  description?: string
  imageUrl: string
}

export default function ProductActions({
  id,
  title,
  price,
  priceA3,
  category,
  description,
  imageUrl,
}: ProductActionsProps) {
  const [size, setSize] = useState("A4")
  const { addItem } = useCart()
  const { toast } = useToast()

  // Calculate price based on size
  const currentPrice = size === "A3" ? priceA3 : price

  const handleAddToCart = () => {
    addItem({
      id,
      title,
      price: currentPrice,
      category,
      imageUrl,
      size,
      material: "Premium Paper", // Default material since buttons are removed
    })

    toast({
      title: "Added to cart",
      description: `${title} (${size}) has been added to your cart.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 mt-1">{category}</p>
      </div>

      <div className="text-2xl font-bold">₹{currentPrice}</div>

      {description && <p className="text-gray-700">{description}</p>}

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Size</h3>
          <RadioGroup value={size} onValueChange={setSize} className="flex flex-wrap gap-3">
            {["A4", "A3"].map((sizeOption) => (
              <div key={sizeOption}>
                <RadioGroupItem value={sizeOption} id={`size-${sizeOption}`} className="peer hidden" />
                <Label
                  htmlFor={`size-${sizeOption}`}
                  className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white transition-all"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{sizeOption}</span>
                    <span className="text-xs opacity-75">₹{sizeOption === "A3" ? priceA3 : price}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Button onClick={handleAddToCart} className="w-full">
        Add to Cart - ₹{currentPrice}
      </Button>

      <div className="text-sm text-gray-500 space-y-2">
        <p>• Free shipping on orders over ₹999</p>
        <p>• Printed on premium quality paper</p>
        <p>• Ships within 2-3 business days</p>
        <p>• High-resolution printing guaranteed</p>
      </div>
    </div>
  )
}
