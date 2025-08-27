import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, customerInfo, cartItems } = await request.json()

    // Create order in Razorpay (this would be the actual Razorpay API call)
    // For demo purposes, we'll simulate the order creation
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store pending booking in database
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          total_amount: amount,
          booking_status: "pending",
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          order_id: orderId,
        },
      ])
      .select()
      .single()

    if (bookingError) {
      console.error("[v0] Booking creation error:", bookingError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    // Return order details for frontend
    // Note: Replace "rzp_test_demo" with your actual Razorpay public key in production
    return NextResponse.json({
      orderId,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      bookingId: booking.id,
      razorpayKey: "rzp_test_demo", // Replace with your actual Razorpay public key
    })
  } catch (error) {
    console.error("[v0] Payment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
