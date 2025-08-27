"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Venue {
  id: string
  name: string
  city: string
  state: string
}

interface EventCreateFormProps {
  venues: Venue[]
  userId: string
}

export function EventCreateForm({ venues, userId }: EventCreateFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue_id: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    base_price: "",
    total_seats: "",
    featured: false,
    tags: "",
  })

  const [seatCategories, setSeatCategories] = useState([
    { name: "General Admission", price: "", seats: "", description: "" },
  ])

  const categories = [
    "Music",
    "Theater",
    "Sports",
    "Technology",
    "Food & Drink",
    "Arts & Culture",
    "Education",
    "Business",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`)

      // Create event
      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          venue_id: formData.venue_id,
          organizer_id: userId,
          start_date: startDateTime.toISOString(),
          end_date: endDateTime.toISOString(),
          base_price: Number.parseFloat(formData.base_price),
          total_seats: Number.parseInt(formData.total_seats),
          available_seats: Number.parseInt(formData.total_seats),
          tags: formData.tags.split(",").map((tag) => tag.trim()),
          featured: formData.featured,
          status: "draft",
        })
        .select()
        .single()

      if (eventError) throw eventError

      // Create seat categories
      const seatCategoryData = seatCategories.map((category) => ({
        event_id: event.id,
        name: category.name,
        price: Number.parseFloat(category.price),
        total_seats: Number.parseInt(category.seats),
        available_seats: Number.parseInt(category.seats),
        description: category.description,
      }))

      const { error: categoryError } = await supabase.from("seat_categories").insert(seatCategoryData)

      if (categoryError) throw categoryError

      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addSeatCategory = () => {
    setSeatCategories([...seatCategories, { name: "", price: "", seats: "", description: "" }])
  }

  const removeSeatCategory = (index: number) => {
    setSeatCategories(seatCategories.filter((_, i) => i !== index))
  }

  const updateSeatCategory = (index: number, field: string, value: string) => {
    const updated = [...seatCategories]
    updated[index] = { ...updated[index], [field]: value }
    setSeatCategories(updated)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="music, festival, outdoor"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
            />
            <Label htmlFor="featured">Featured Event</Label>
          </div>
        </CardContent>
      </Card>

      {/* Date, Time & Venue */}
      <Card>
        <CardHeader>
          <CardTitle>Date, Time & Venue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="venue">Venue *</Label>
            <Select value={formData.venue_id} onValueChange={(value) => setFormData({ ...formData, venue_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}, {venue.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ticket Categories</CardTitle>
            <Button type="button" variant="outline" onClick={addSeatCategory}>
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {seatCategories.map((category, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Category {index + 1}</h4>
                {seatCategories.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSeatCategory(index)}>
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Category Name *</Label>
                  <Input
                    value={category.name}
                    onChange={(e) => updateSeatCategory(index, "name", e.target.value)}
                    placeholder="e.g., General Admission"
                    required
                  />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={category.price}
                    onChange={(e) => updateSeatCategory(index, "price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label>Available Seats *</Label>
                  <Input
                    type="number"
                    value={category.seats}
                    onChange={(e) => updateSeatCategory(index, "seats", e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={category.description}
                  onChange={(e) => updateSeatCategory(index, "description", e.target.value)}
                  placeholder="Describe what's included with this ticket type"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
