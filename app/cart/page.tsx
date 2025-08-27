"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
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
  eventImage?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems)
    localStorage.setItem("cart", JSON.stringify(newItems))
  }

  const removeItem = (itemId: string) => {
    const newItems = cartItems.filter((item) => item.id !== itemId)
    updateCart(newItems)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    const newItems = cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    updateCart(newItems)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some tickets to get started!</p>
          <Button asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Badge variant="secondary">{getTotalItems()} items</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    {item.eventImage && (
                      <img
                        src={item.eventImage || "/placeholder.svg"}
                        alt={item.eventTitle}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.eventTitle}</h3>
                    <p className="text-sm text-muted-foreground">{item.eventVenue}</p>
                    <p className="text-sm text-muted-foreground">{item.eventDate}</p>
                    <Badge variant="outline" className="mt-2">
                      {item.ticketType}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({getTotalItems()} items)</span>
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
                <span>₹{Math.round(getTotalPrice() * 1.2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={() => router.push("/checkout")}>
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/events">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
