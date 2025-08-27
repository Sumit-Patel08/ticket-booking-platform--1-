import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  category: string
  start_date: string
  end_date: string
  base_price: number
  available_seats: number
  total_seats: number
  images: string[]
  featured: boolean
  venues: {
    name: string
    city: string
    state: string
    country: string
  }
  seat_categories: {
    name: string
    price: number
  }[]
}

interface EventsGridProps {
  events: Event[]
}

export function EventsGrid({ events }: EventsGridProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const startDate = new Date(event.start_date)
        const minPrice = Math.min(...event.seat_categories.map((cat) => cat.price))
        const availabilityPercentage = (event.available_seats / event.total_seats) * 100

        return (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative">
              <Image
                src={event.images?.[0] || "/placeholder.svg?height=200&width=400"}
                alt={event.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{event.category}</Badge>
              {event.featured && <Badge className="absolute top-3 right-3 bg-orange-500 text-white">Featured</Badge>}
              {availabilityPercentage < 20 && (
                <Badge className="absolute bottom-3 left-3 bg-red-500 text-white">Almost Sold Out</Badge>
              )}
            </div>

            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {startDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.venues.name}, {event.venues.city}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{event.available_seats} available</span>
                </div>
                <div className="text-lg font-bold text-primary">From ${minPrice}</div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/events/${event.id}/book`}>Quick Book</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
