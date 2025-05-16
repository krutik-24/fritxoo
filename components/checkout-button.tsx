"use client"

import { useRouter } from "next/navigation"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Minimum order value
const MINIMUM_ORDER_VALUE = 259

interface CheckoutButtonProps extends ButtonProps {
  redirectTo?: string
}

export default function CheckoutButton({
  children = "Proceed to Checkout",
  redirectTo = "/checkout",
  ...props
}: CheckoutButtonProps) {
  const { subtotal, itemCount } = useCart()
  const router = useRouter()

  const isDisabled = subtotal < MINIMUM_ORDER_VALUE || itemCount === 0

  const handleCheckout = () => {
    if (!isDisabled) {
      router.push(redirectTo)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              onClick={handleCheckout}
              disabled={isDisabled}
              className="w-full bg-black text-white hover:bg-gray-800"
              {...props}
            >
              {children}
            </Button>
          </span>
        </TooltipTrigger>
        {isDisabled && (
          <TooltipContent>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {itemCount === 0 ? "Your cart is empty" : `Minimum order value is Rs. ${MINIMUM_ORDER_VALUE}`}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
