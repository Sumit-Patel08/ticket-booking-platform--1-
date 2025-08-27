"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface TicketSelectionProps {
  event: {
    seat_categories: {
      id: string
      name: string
      price: number
      available_seats: number
      description: string
    }[]
  }
  bookingData: {
    selectedCategory: string
    quantity: number
  }
  onUpdate: (data: any) => void
  onNext: () => void
}

export function TicketSelection({ event, bookingData, onUpdate, onNext }: TicketSelectionProps) {
  const selectedCategory = event.seat_categories.find((cat) => cat.id === bookingData.selectedCategory)
  const maxQuantity = selectedCategory ? Math.min(8, selectedCategory.available_seats) : 0

  const handleCategoryChange = (categoryId: string) => {
    onUpdate({ selectedCategory: categoryId, quantity: 1 })
  }

  const handleQuantityChange = (quantity: string) => {
    onUpdate({ quantity: Number.parseInt(quantity) })
  }

  const canProceed = bookingData.selectedCategory && bookingData.quantity > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ticket Categories */}
        <div className="space-y-4">
          <h3 className="font-medium">Available Ticket Types</h3>
          <div className="space-y-3">
            {event.seat_categories.map((category) => (
              <div
                key={category.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  bookingData.selectedCategory === category.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{category.name}</h4>
                      {category.available_seats < 50 && (
                        <Badge variant="destructive" className="text-xs">
                          Limited
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{category.available_seats} available</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">${category.price}</div>
                    <div className="text-sm text-muted-foreground">per ticket</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        {bookingData.selectedCategory && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Tickets</label>
            <Select value={bookingData.quantity.toString()} onValueChange={handleQuantityChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "ticket" : "tickets"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Continue Button */}
        <Button onClick={onNext} disabled={!canProceed} className="w-full" size="lg">
          Continue to Information
        </Button>
      </CardContent>
    </Card>
  )
}
