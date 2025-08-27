"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface CustomerInfoProps {
  bookingData: {
    customerInfo: {
      firstName: string
      lastName: string
      email: string
      phone: string
    }
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function CustomerInfo({ bookingData, onUpdate, onNext, onBack }: CustomerInfoProps) {
  const [specialRequests, setSpecialRequests] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      customerInfo: {
        ...bookingData.customerInfo,
        [field]: value,
      },
    })

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!bookingData.customerInfo.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!bookingData.customerInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!bookingData.customerInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(bookingData.customerInfo.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!bookingData.customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={bookingData.customerInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={bookingData.customerInfo.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={bookingData.customerInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          <p className="text-sm text-muted-foreground mt-1">Your tickets will be sent to this email</p>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={bookingData.customerInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
          <Textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requirements or requests..."
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={handleNext} className="flex-1">
            Continue to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
