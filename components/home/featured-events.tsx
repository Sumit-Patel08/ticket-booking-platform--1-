import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Star } from "lucide-react"
import Image from "next/image"

const featuredEvents = [
  {
    id: 1,
    title: "Summer Music Festival 2024",
    description: "Join us for an unforgettable weekend of music featuring top artists from around the world.",
    image: "/music-festival-stage-with-crowd.png",
    date: "July 15-17, 2024",
    location: "Central Park, New York",
    price: "From $89",
    category: "Music",
    rating: 4.8,
    attendees: "15K+",
    featured: true,
  },
  {
    id: 2,
    title: "Tech Innovation Conference",
    description: "Discover the latest trends in technology and network with industry leaders.",
    image: "/modern-conference-hall-with-tech-presentation.png",
    date: "August 22, 2024",
    location: "Convention Center, San Francisco",
    price: "From $299",
    category: "Technology",
    rating: 4.9,
    attendees: "2K+",
    featured: true,
  },
  {
    id: 3,
    title: "Broadway Musical Night",
    description: "Experience the magic of Broadway with this spectacular musical performance.",
    image: "/broadway-theater-stage-with-dramatic-lighting.png",
    date: "September 5, 2024",
    location: "Broadway Theater, New York",
    price: "From $125",
    category: "Theater",
    rating: 4.7,
    attendees: "800+",
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
                <Button className="w-full">Book Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
