import { NextResponse } from "next/server"
import crypto from "crypto"

// Razorpay key secret for verification
const KEY_SECRET = "V1LWrxN2HrHO0kqw9TdnBXNv"

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", KEY_SECRET).update(body).digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Payment is verified
      // In a real application, you would update your database here
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
