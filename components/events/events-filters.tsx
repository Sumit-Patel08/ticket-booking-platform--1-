"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

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

const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA"]

export function EventsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 500])

  const handleFilterChange = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())

    if (checked) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/events?${params.toString()}`)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    const params = new URLSearchParams(searchParams.toString())
    params.set("minPrice", values[0].toString())
    params.set("maxPrice", values[1].toString())
    router.push(`/events?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/events")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={searchParams.get("category") === category}
                    onCheckedChange={(checked) => handleFilterChange("category", category, checked as boolean)}
                  />
                  <Label htmlFor={category} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Location</h3>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={location}
                    checked={searchParams.get("location") === location}
                    onCheckedChange={(checked) => handleFilterChange("location", location, checked as boolean)}
                  />
                  <Label htmlFor={location} className="text-sm">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
