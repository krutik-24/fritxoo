import { ClientProviders } from "@/components/client-providers"
import ClientOrderSuccess from "@/components/client-order-success"

export default function OrderSuccessPage() {
  return (
    <ClientProviders>
      <ClientOrderSuccess />
    </ClientProviders>
  )
}
