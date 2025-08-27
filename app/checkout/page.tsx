"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventVenue: string
  ticketType: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getFinalTotal = () => {
    return Math.round(getTotalPrice() * 1.2) // Including fees and GST
  }

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Create payment order on server
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getFinalTotal(),
          customerInfo,
          cartItems,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment order")
      }

      const orderData = await response.json()

      const options = {
        key: orderData.razorpayKey, // Key is now provided by server
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TicketBooking",
        description: "Event Ticket Booking",
        order_id: orderData.orderId,
        handler: async (paymentResponse: any) => {
          console.log("[v0] Payment successful:", paymentResponse)

          // Verify payment on server
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              signature: paymentResponse.razorpay_signature,
              bookingId: orderData.bookingId,
            }),
          })

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json()

            // Clear cart
            localStorage.removeItem("cart")

            // Redirect to success page
            router.push(`/booking-success?bookingId=${verifyData.bookingId}`)
          } else {
            alert("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#3B82F6",
        },
      }

      // Load Razorpay script and open payment modal
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">No Items to Checkout</h1>
          <Button asChild>
            <Link href="/cart">Go to Cart</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{item.eventTitle}</h4>
                    <p className="text-sm text-muted-foreground">{item.ticketType}</p>
                    <Badge variant="outline">Qty: {item.quantity}</Badge>
                  </div>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Fee</span>
                  <span>₹{Math.round(getTotalPrice() * 0.02)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{Math.round(getTotalPrice() * 0.18)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{getFinalTotal()}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={isLoading || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
              >
                {isLoading ? "Processing..." : `Pay ₹{getFinalTotal()}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
