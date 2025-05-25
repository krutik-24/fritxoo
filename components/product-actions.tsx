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
  category: string
  description?: string
  imageUrl: string
}

export default function ProductActions({ id, title, price, category, description, imageUrl }: ProductActionsProps) {
  const [size, setSize] = useState("A4")
  const [material, setMaterial] = useState("Matte Paper")
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id,
      title,
      price,
      category,
      imageUrl,
      size,
      material,
    })

    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 mt-1">{category}</p>
      </div>

      <div className="text-2xl font-bold">₹{price.toFixed(2)}</div>

      {description && <p className="text-gray-700">{description}</p>}

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Size</h3>
          <RadioGroup value={size} onValueChange={setSize} className="flex flex-wrap gap-3">
            {["A4", "A3", "A2"].map((sizeOption) => (
              <div key={sizeOption}>
                <RadioGroupItem value={sizeOption} id={`size-${sizeOption}`} className="peer hidden" />
                <Label
                  htmlFor={`size-${sizeOption}`}
                  className="flex min-w-[60px] cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white"
                >
                  {sizeOption}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <h3 className="font-medium mb-2">Material</h3>
          <RadioGroup value={material} onValueChange={setMaterial} className="flex flex-wrap gap-3">
            {["Matte Paper", "Glossy Paper", "Canvas"].map((materialOption) => (
              <div key={materialOption}>
                <RadioGroupItem value={materialOption} id={`material-${materialOption}`} className="peer hidden" />
                <Label
                  htmlFor={`material-${materialOption}`}
                  className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white"
                >
                  {materialOption}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Button onClick={handleAddToCart} className="w-full">
        Add to Cart
      </Button>

      <div className="text-sm text-gray-500 space-y-2">
        <p>• Free shipping on orders over Rs. 999</p>
        <p>• Printed on premium quality paper</p>
        <p>• Ships within 2-3 business days</p>
      </div>
    </div>
  )
}
