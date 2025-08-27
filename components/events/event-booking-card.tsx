"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Heart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface EventBookingCardProps {
  event: {
    id: string
    title: string
    start_date: string
    available_seats: number
    total_seats: number
    venues: {
      name: string
      city: string
    }
    seat_categories: {
      id: string
      name: string
      price: number
      available_seats: number
    }[]
  }
  user: User | null
}

export function EventBookingCard({ event, user }: EventBookingCardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [isFavorited, setIsFavorited] = useState(false)

  const startDate = new Date(event.start_date)
  const selectedCategoryData = event.seat_categories.find((cat) => cat.id === selectedCategory)
  const totalPrice = selectedCategoryData ? selectedCategoryData.price * quantity : 0
  const availabilityPercentage = (event.available_seats / event.total_seats) * 100

  return (
    <div className="sticky top-24">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                {startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.venues.name}, {event.venues.city}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsFavorited(!isFavorited)} className="shrink-0">
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Availability Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{event.available_seats} tickets left</span>
            </div>
            {availabilityPercentage < 20 && (
              <Badge variant="destructive" className="text-xs">
                Almost Sold Out
              </Badge>
            )}
          </div>

          {/* Ticket Category Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Ticket Type</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose ticket type" />
              </SelectTrigger>
              <SelectContent>
                {event.seat_categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{category.name}</span>
                      <span className="ml-4 font-semibold">${category.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Selection */}
          {selectedCategory && (
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(8, selectedCategoryData?.available_seats || 0) }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "ticket" : "tickets"}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Summary */}
          {selectedCategory && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Subtotal ({quantity} tickets)</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Service fees</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg mt-2 pt-2 border-t">
                <span>Total</span>
                <span>${(totalPrice * 1.1).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Booking Button */}
          <div className="space-y-2">
            {user ? (
              <Button className="w-full" size="lg" disabled={!selectedCategory || event.available_seats === 0} asChild>
                <Link href={`/events/${event.id}/book?category=${selectedCategory}&quantity=${quantity}`}>
                  {event.available_seats === 0 ? "Sold Out" : "Book Now"}
                </Link>
              </Button>
            ) : (
              <Button className="w-full" size="lg" asChild>
                <Link href="/auth/login">Sign In to Book</Link>
              </Button>
            )}

            <Button variant="outline" className="w-full bg-transparent">
              Add to Wishlist
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>✓ Secure payment processing</p>
            <p>✓ Instant ticket delivery</p>
            <p>✓ 24/7 customer support</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
