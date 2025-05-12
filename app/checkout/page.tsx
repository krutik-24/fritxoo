import { ClientProviders } from "@/components/client-providers"
import ClientCheckoutRazorpay from "@/components/client-checkout-razorpay"

export default function CheckoutPage() {
  return (
    <ClientProviders>
      <ClientCheckoutRazorpay />
    </ClientProviders>
  )
}
