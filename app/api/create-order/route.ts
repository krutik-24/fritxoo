import { NextResponse } from "next/server"
import Razorpay from "razorpay"

// Initialize Razorpay with the provided keys
const razorpay = new Razorpay({
  key_id: "rzp_live_BV1EVSSIhJdOpz",
  key_secret: "V1LWrxN2HrHO0kqw9TdnBXNv",
})

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt, notes } = await req.json()

    // Validate the amount (minimum order value)
    if (amount < 25900) {
      // Amount in paise (259 * 100)
      return NextResponse.json({ error: "Minimum order value is Rs. 259" }, { status: 400 })
    }

    // Create a Razorpay order
    const order = await razorpay.orders.create({
      amount, // amount in paise (e.g., 10000 for ₹100)
      currency,
      receipt,
      notes,
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
