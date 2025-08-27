"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { TicketSelection } from "./ticket-selection"
import { CustomerInfo } from "./customer-info"
import { PaymentForm } from "./payment-form"
import { BookingConfirmation } from "./booking-confirmation"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface BookingFlowProps {
  event: {
    id: string
    title: string
    start_date: string
    end_date: string
    venues: {
      name: string
      address: string
      city: string
      state: string
    }
    seat_categories: {
      id: string
      name: string
      price: number
      available_seats: number
      description: string
    }[]
  }
  user: User
  profile: any
  initialCategory?: string
  initialQuantity?: number
}

export function BookingFlow({ event, user, profile, initialCategory, initialQuantity = 1 }: BookingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    selectedCategory: initialCategory || "",
    quantity: initialQuantity,
    customerInfo: {
      firstName: profile?.full_name?.split(" ")[0] || "",
      lastName: profile?.full_name?.split(" ")[1] || "",
      email: user.email || "",
      phone: profile?.phone || "",
    },
    paymentInfo: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
    bookingId: "",
  })

  const steps = [
    { number: 1, title: "Select Tickets", description: "Choose your tickets" },
    { number: 2, title: "Your Information", description: "Enter your details" },
    { number: 3, title: "Payment", description: "Complete your purchase" },
    { number: 4, title: "Confirmation", description: "Booking confirmed" },
  ]

  const selectedCategoryData = event.seat_categories.find((cat) => cat.id === bookingData.selectedCategory)
  const subtotal = selectedCategoryData ? selectedCategoryData.price * bookingData.quantity : 0
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(event.start_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.venues.name}, {event.venues.city}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <Progress value={(currentStep / 4) * 100} className="mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <TicketSelection event={event} bookingData={bookingData} onUpdate={updateBookingData} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <CustomerInfo
              bookingData={bookingData}
              onUpdate={updateBookingData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <PaymentForm
              bookingData={bookingData}
              onUpdate={updateBookingData}
              onNext={handleNext}
              onBack={handleBack}
              event={event}
              user={user}
              total={total}
            />
          )}
          {currentStep === 4 && <BookingConfirmation bookingData={bookingData} event={event} />}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCategoryData && (
                <>
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{selectedCategoryData.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${selectedCategoryData.price} × {bookingData.quantity}
                      </div>
                    </div>
                    <div className="font-medium">${subtotal.toFixed(2)}</div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>✓ Secure payment processing</p>
                    <p>✓ Instant ticket delivery</p>
                    <p>✓ 24/7 customer support</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
