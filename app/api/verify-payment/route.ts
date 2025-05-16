import { NextResponse } from "next/server"
import crypto from "crypto"

// Razorpay key secret for verification
const KEY_SECRET = "XRE4yCvAQFlDMvSiCcdu1Ou9"

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer_details } = await req.json()

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", KEY_SECRET).update(body).digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Payment is verified
      // In a real application, you would:
      // 1. Update your database with order details
      // 2. Store customer information
      // 3. Update inventory
      // 4. Send confirmation emails

      console.log("Payment verified successfully", {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        customer: customer_details,
      })

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      })
    } else {
      return NextResponse.json(
        {
          error: "Payment verification failed",
          message: "The payment signature could not be verified",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        error: "Failed to verify payment",
        message: "An unexpected error occurred during payment verification",
      },
      { status: 500 },
    )
  }
}
