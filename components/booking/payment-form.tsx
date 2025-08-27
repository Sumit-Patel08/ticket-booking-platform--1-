"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Shield } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface PaymentFormProps {
  bookingData: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
  event: any
  user: User
  total: number
}

export function PaymentForm({ bookingData, onUpdate, onNext, onBack, event, user, total }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      paymentInfo: {
        ...bookingData.paymentInfo,
        [field]: value,
      },
    })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {}

    if (!bookingData.paymentInfo.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required"
    } else if (bookingData.paymentInfo.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!bookingData.paymentInfo.expiryDate) {
      newErrors.expiryDate = "Expiry date is required"
    }

    if (!bookingData.paymentInfo.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (bookingData.paymentInfo.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV"
    }

    if (!bookingData.paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateBookingReference = () => {
    return "BK" + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  const processPayment = async () => {
    if (!validatePaymentForm()) return

    setIsProcessing(true)

    try {
      // Generate booking reference
      const bookingReference = generateBookingReference()

      // Create booking in database
      const selectedCategory = event.seat_categories.find((cat: any) => cat.id === bookingData.selectedCategory)

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          event_id: event.id,
          seat_category_id: bookingData.selectedCategory,
          quantity: bookingData.quantity,
          total_amount: total,
          status: "confirmed",
          booking_reference: bookingReference,
          customer_name: `${bookingData.customerInfo.firstName} ${bookingData.customerInfo.lastName}`,
          customer_email: bookingData.customerInfo.email,
          customer_phone: bookingData.customerInfo.phone,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Create payment record (mock payment for demo)
      const { error: paymentError } = await supabase.from("payments").insert({
        booking_id: booking.id,
        amount: total,
        status: "completed",
        payment_method: "credit_card",
        transaction_id: "txn_" + Date.now(),
        payment_gateway: "demo_gateway",
      })

      if (paymentError) throw paymentError

      // Update booking data with booking ID
      onUpdate({ bookingId: booking.id, bookingReference })

      // Move to confirmation
      onNext()
    } catch (error) {
      console.error("Payment processing error:", error)
      setErrors({ general: "Payment processing failed. Please try again." })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Notice */}
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">Your payment information is secure and encrypted</span>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number *</Label>
            <Input
              id="cardNumber"
              value={bookingData.paymentInfo.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                value={bookingData.paymentInfo.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                value={bookingData.paymentInfo.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").substring(0, 4))}
                placeholder="123"
                maxLength={4}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="cardholderName">Cardholder Name *</Label>
            <Input
              id="cardholderName"
              value={bookingData.paymentInfo.cardholderName}
              onChange={(e) => handleInputChange("cardholderName", e.target.value)}
              placeholder="John Doe"
              className={errors.cardholderName ? "border-red-500" : ""}
            />
            {errors.cardholderName && <p className="text-sm text-red-500 mt-1">{errors.cardholderName}</p>}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="font-medium mb-3">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(total / 1.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>${((total * 0.1) / 1.1).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{errors.general}</div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent" disabled={isProcessing}>
            Back
          </Button>
          <Button onClick={processPayment} className="flex-1" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Lock className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Complete Payment
              </>
            )}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>✓ 256-bit SSL encryption</p>
          <p>✓ PCI DSS compliant</p>
          <p>✓ Money-back guarantee</p>
        </div>
      </CardContent>
    </Card>
  )
}
