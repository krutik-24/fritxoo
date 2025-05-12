import { ClientProviders } from "@/components/client-providers"
import ClientCart from "@/components/client-cart"

export default function CartPage() {
  return (
    <ClientProviders>
      <ClientCart />
    </ClientProviders>
  )
}
