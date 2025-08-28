import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Star } from "lucide-react"
import Image from "next/image"

const featuredEvents = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    title: "Aditya Ghadvi Live Concert in Ahmedabad",
    description: "Experience the soulful voice of Aditya Ghadvi live in concert. Join us for an evening of Gujarati folk music, devotional songs, and contemporary hits.",
    image: "/jazz-club-with-dim-lighting-and-musicians.jpg",
    date: "September 15, 2024",
    location: "Sardar Patel Stadium, Ahmedabad",
    price: "From ₹999",
    category: "Music",
    rating: 4.9,
    attendees: "48K+",
    featured: true,
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    title: "Akash Gupta Standup Comedy in Mumbai",
    description: "Get ready to laugh until your stomach hurts! Akash Gupta brings his hilarious standup comedy show to Mumbai.",
    image: "/comedy-club-stage-with-microphone-and-spotlight.png",
    date: "September 22, 2024",
    location: "NSCI Dome, Mumbai",
    price: "From ₹799",
    category: "Comedy",
    rating: 4.8,
    attendees: "5.8K+",
    featured: true,
  },
]

export function FeaturedEvents() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
            <p className="text-muted-foreground">Don't miss out on these amazing upcoming events</p>
          </div>
          <Button variant="outline">View All Events</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{event.category}</Badge>
                {event.featured && <Badge className="absolute top-3 right-3 bg-orange-500 text-white">Featured</Badge>}
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
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.attendees}</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">{event.price}</div>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full" asChild>
                  <a href={`/events/${event.id}`}>Book Now</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
