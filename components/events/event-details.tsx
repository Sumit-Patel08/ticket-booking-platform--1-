import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface EventDetailsProps {
  event: {
    id: string
    title: string
    description: string
    category: string
    start_date: string
    end_date: string
    base_price: number
    total_seats: number
    available_seats: number
    images: string[]
    tags: string[]
    featured: boolean
    venues: {
      id: string
      name: string
      address: string
      city: string
      state: string
      country: string
      capacity: number
      description: string
      amenities: string[]
    }
    seat_categories: {
      id: string
      name: string
      price: number
      available_seats: number
      total_seats: number
      description: string
    }[]
  }
}

export function EventDetails({ event }: EventDetailsProps) {
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))

  return (
    <div className="space-y-6">
      {/* Event Images */}
      <div className="relative">
        <Image
          src={event.images?.[0] || "/placeholder.svg?height=400&width=800"}
          alt={event.title}
          width={800}
          height={400}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-primary text-primary-foreground">{event.category}</Badge>
          {event.featured && <Badge className="bg-orange-500 text-white">Featured</Badge>}
        </div>
        <Button variant="secondary" size="icon" className="absolute top-4 right-4">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Event Header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {startDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {startDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {endDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>
              {event.venues.name}, {event.venues.city}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {event.available_seats} of {event.total_seats} available
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {event.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Event Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Event</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </CardContent>
      </Card>

      {/* Venue Information */}
      <Card>
        <CardHeader>
          <CardTitle>Venue Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{event.venues.name}</h3>
            <p className="text-muted-foreground">
              {event.venues.address}
              <br />
              {event.venues.city}, {event.venues.state} {event.venues.country}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">{event.venues.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Capacity: {event.venues.capacity.toLocaleString()}</span>
            </div>
          </div>

          {event.venues.amenities && event.venues.amenities.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {event.venues.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event.seat_categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.available_seats} of {category.total_seats} available
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">${category.price}</div>
                  <div className="text-sm text-muted-foreground">per ticket</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
