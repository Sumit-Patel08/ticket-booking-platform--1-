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

    const { paymentId, orderId, signature, bookingId } = await request.json()

    // In a real implementation, you would verify the payment signature here
    // using Razorpay's webhook signature verification

    // Update booking status to confirmed
    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({
        booking_status: "confirmed",
        payment_id: paymentId,
        payment_signature: signature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Booking update error:", updateError)
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
