"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface TimeSlotAvailabilityProps {
  event: {
    id: string
    title: string
    start_date: string
    end_date: string
    description: string
    available_seats: number
    total_seats: number
    venues: {
      name: string
      address: string
      city: string
      state: string
      capacity: number
    }
    seat_categories: {
      id: string
      name: string
      price: number
      available_seats: number
      total_seats: number
    }[]
  }
  user: User | null
}

// Generate time slots based on event type and duration
function generateTimeSlots(startDate: string, endDate: string, eventTitle: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const slots: Array<{
    id: string
    startTime: Date
    endTime: Date
    availableSeats: number
    totalSeats: number
    price: number
    isAvailable: boolean
    label: string
  }> = []
  
  // Different time slots based on event type
  if (eventTitle.includes("Aditya Ghadvi")) {
    // Concert has multiple shows throughout the day
    const showTimes = [
      { start: 15, end: 18, label: "Afternoon Show" },
      { start: 19, end: 23, label: "Evening Show" }
    ]
    
    showTimes.forEach((show, i) => {
      const slotStart = new Date(start)
      slotStart.setHours(show.start, 0, 0, 0)
      
      const slotEnd = new Date(start)
      slotEnd.setHours(show.end, 0, 0, 0)
      
      slots.push({
        id: `concert-slot-${i}`,
        startTime: slotStart,
        endTime: slotEnd,
        availableSeats: i === 0 ? 25000 : 23500, // Evening show more popular
        totalSeats: 50000,
        price: 999,
        isAvailable: true,
        label: show.label
      })
    })
  } else if (eventTitle.includes("Akash Gupta")) {
    // Comedy show has multiple shows
    const showTimes = [
      { start: 17, end: 19, label: "Early Show" },
      { start: 20, end: 22.5, label: "Prime Show" },
      { start: 23, end: 1, label: "Late Night Show" }
    ]
    
    showTimes.forEach((show, i) => {
      const slotStart = new Date(start)
      slotStart.setHours(Math.floor(show.start), (show.start % 1) * 60, 0, 0)
      
      const slotEnd = new Date(start)
      if (show.end >= 24) {
        slotEnd.setDate(slotEnd.getDate() + 1)
        slotEnd.setHours(show.end - 24, (show.end % 1) * 60, 0, 0)
      } else {
        slotEnd.setHours(Math.floor(show.end), (show.end % 1) * 60, 0, 0)
      }
      
      slots.push({
        id: `comedy-slot-${i}`,
        startTime: slotStart,
        endTime: slotEnd,
        availableSeats: i === 1 ? 1800 : 2000, // Prime show more popular
        totalSeats: 6000,
        price: 799,
        isAvailable: true,
        label: show.label
      })
    })
  }
  
  return slots
}

export function TimeSlotAvailability({ event, user }: TimeSlotAvailabilityProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  
  const startDate = new Date(event.start_date)
  const timeSlots = generateTimeSlots(event.start_date, event.end_date, event.title)
  
  const selectedSlotData = timeSlots.find(slot => slot.id === selectedSlot)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event Details
        </Link>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {startDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.venues.name}, {event.venues.city}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Time Slots */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Available Time Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {timeSlots.map((slot) => {
                  const availabilityPercentage = (slot.availableSeats / slot.totalSeats) * 100
                  const isSelected = selectedSlot === slot.id
                  
                  return (
                    <div
                      key={slot.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : slot.isAvailable 
                            ? "border-border hover:border-primary/50" 
                            : "border-border bg-muted/50 cursor-not-allowed"
                      }`}
                      onClick={() => slot.isAvailable && setSelectedSlot(slot.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {slot.startTime.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })} - {slot.endTime.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                            <Badge variant="outline">{slot.label}</Badge>
                            {!slot.isAvailable && (
                              <Badge variant="destructive">Sold Out</Badge>
                            )}
                            {slot.isAvailable && availabilityPercentage < 20 && (
                              <Badge variant="secondary">Few Left</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {slot.availableSeats} seats available
                            </div>
                            <span className="font-medium text-foreground">
                              Starting from ₹{slot.price}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {slot.isAvailable && (
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${100 - availabilityPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selection Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSlot ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Event</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span>{startDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time</span>
                        <span>
                          {selectedSlotData?.startTime.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })} - {selectedSlotData?.endTime.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Venue</span>
                        <span>{event.venues.name}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Available Seats</span>
                        <span className="text-green-600 font-semibold">
                          {selectedSlotData?.availableSeats}
                        </span>
                      </div>
                      
                      {user ? (
                        <Button className="w-full" size="lg" asChild>
                          <Link href={`/events/${event.id}/book?slot=${selectedSlot}`}>
                            Continue to Booking
                          </Link>
                        </Button>
                      ) : (
                        <Button className="w-full" size="lg" asChild>
                          <Link href="/auth/login">Sign In to Book</Link>
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a time slot to continue
                    </p>
                  </div>
                )}

                {/* Event Info */}
                <div className="border-t pt-4 space-y-2">
                  <h4 className="font-medium">Event Information</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Capacity: {event.venues.capacity}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
