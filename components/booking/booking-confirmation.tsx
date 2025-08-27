"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, Calendar, MapPin, Users, Share2 } from "lucide-react"
import Link from "next/link"

interface BookingConfirmationProps {
  bookingData: any
  event: any
}

export function BookingConfirmation({ bookingData, event }: BookingConfirmationProps) {
  const selectedCategory = event.seat_categories.find((cat: any) => cat.id === bookingData.selectedCategory)
  const subtotal = selectedCategory ? selectedCategory.price * bookingData.quantity : 0
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
            <p className="text-green-700">
              Your tickets have been successfully booked. You'll receive a confirmation email shortly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Booking Reference</Label>
              <div className="text-lg font-mono font-bold">{bookingData.bookingReference}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <div>
                <Badge className="bg-green-500 text-white">Confirmed</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">{event.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(event.start_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.venues.name}, {event.venues.address}, {event.venues.city}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {bookingData.quantity} × {selectedCategory?.name}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tickets ({bookingData.quantity})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Service Fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Paid</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Name</Label>
              <div>
                {bookingData.customerInfo.firstName} {bookingData.customerInfo.lastName}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <div>{bookingData.customerInfo.email}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
              <div>{bookingData.customerInfo.phone}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Tickets
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          <Mail className="mr-2 h-4 w-4" />
          Email Tickets
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          <Share2 className="mr-2 h-4 w-4" />
          Share Event
        </Button>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <div className="font-medium">Check Your Email</div>
              <div className="text-sm text-muted-foreground">
                We've sent your tickets and booking confirmation to {bookingData.customerInfo.email}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <div className="font-medium">Save Your Tickets</div>
              <div className="text-sm text-muted-foreground">
                Download or save your tickets to your phone for easy access at the event
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <div className="font-medium">Arrive Early</div>
              <div className="text-sm text-muted-foreground">
                Plan to arrive 30-60 minutes before the event starts for smooth entry
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Home */}
      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
