"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useCart } from "@/context/cart-context"

interface ProductActionsProps {
  product: {
    id: string
    title: string
    category: string
    price: number
    imageData?: string | null
  }
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [size, setSize] = useState("A4")
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    addItem(
      {
        ...product,
        size,
      },
      quantity,
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Size</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={size === "A4" ? "default" : "outline"}
            className={`rounded-full ${size === "A4" ? "bg-black text-white" : ""}`}
            onClick={() => setSize("A4")}
          >
            A4
          </Button>
          <Button
            variant={size === "A3" ? "default" : "outline"}
            className={`rounded-full ${size === "A3" ? "bg-black text-white" : ""}`}
            onClick={() => setSize("A3")}
          >
            A3
          </Button>
          <Button
            variant={size === "13x19" ? "default" : "outline"}
            className={`rounded-full ${size === "13x19" ? "bg-black text-white" : ""}`}
            onClick={() => setSize("13x19")}
          >
            13×19"
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Quantity</h3>
        <div className="flex items-center border rounded-md w-32">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={decreaseQuantity}>
            <MinusIcon className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">{quantity}</div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={increaseQuantity}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium">Combo Poster Mega Deals</h3>
        <RadioGroup defaultValue="option-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" id="option-1" />
            <Label htmlFor="option-1">BUY 1 SET GET 1 FREE (ADD 2 SETS TO CART)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" id="option-2" />
            <Label htmlFor="option-2">
              BUY 2 SETS GET 3 FREE (ADD 5 SETS TO CART)
              <span className="ml-2 text-red-500 font-medium">*Best Value – Limited Time Offer!*</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-3" id="option-3" />
            <Label htmlFor="option-3">BUY 3 SETS GET 5 FREE (ADD 8 SETS TO CART)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="bg-black text-white p-4 rounded-lg text-center">
        <p className="font-bold mb-2">Want a custom poster?</p>
        <Button className="bg-red-600 hover:bg-red-700 text-white">Upload your images here</Button>
      </div>

      <div className="space-y-3">
        <Button className="w-full py-6 bg-black text-white hover:bg-gray-800" onClick={handleAddToCart}>
          Add to cart
        </Button>
        <Button className="w-full py-6 bg-black text-white hover:bg-gray-800">Buy Now</Button>
        <p className="text-center text-sm">Secure Checkout With</p>
        <div className="flex justify-center space-x-2">
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
