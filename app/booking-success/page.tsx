"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Calendar } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Booking {
  id: string
  total_amount: number
  booking_status: string
  customer_name: string
  customer_email: string
  customer_phone: string
  payment_id: string
  created_at: string
}

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [qrCode, setQrCode] = useState<string>("")
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const supabase = createClient()

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
      generateQRCode()
    }
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase.from("bookings").select("*").eq("id", bookingId).single()

      if (error) {
        console.error("[v0] Error fetching booking:", error)
        return
      }

      setBooking(data)
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateQRCode = () => {
    // Generate QR code data (booking ID + timestamp)
    const qrData = `BOOKING:${bookingId}:${Date.now()}`
    // For demo purposes, we'll use a QR code generator service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
    setQrCode(qrCodeUrl)
  }

  const downloadTicket = () => {
    // Create a simple ticket download
    const ticketData = {
      bookingId,
      customerName: booking?.customer_name,
      amount: booking?.total_amount,
      date: new Date(booking?.created_at || "").toLocaleDateString(),
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ticketData, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `ticket-${bookingId}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your tickets have been successfully booked</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Booking Details
              <Badge variant="secondary">#{booking.id.slice(-8)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="font-medium">{booking.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{booking.customer_phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">₹{booking.total_amount}</p>
              </div>
            </div>

            <div className="flex justify-center py-4">
              {qrCode && (
                <div className="text-center">
                  <img src={qrCode || "/placeholder.svg"} alt="Booking QR Code" className="mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Show this QR code at the venue</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadTicket} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/dashboard">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Bookings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/">Book More Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
