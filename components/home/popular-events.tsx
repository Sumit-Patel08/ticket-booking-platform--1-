import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, TrendingUp } from "lucide-react"
import Image from "next/image"

const popularEvents = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    title: "Aditya Ghadvi Live Concert",
    image: "/jazz-club-with-dim-lighting-and-musicians.jpg",
    date: "Sep 15, 7:00 PM",
    location: "Sardar Patel Stadium, Ahmedabad",
    price: "₹999",
    trending: true,
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    title: "Akash Gupta Comedy Show",
    image: "/comedy-club-stage-with-microphone-and-spotlight.png",
    date: "Sep 22, 8:00 PM",
    location: "NSCI Dome, Mumbai",
    price: "₹799",
    trending: true,
  },
]

export function PopularEvents() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Trending This Week</h2>
            <p className="text-muted-foreground">Popular events that everyone's talking about</p>
          </div>
          <Button variant="outline">See More Trending</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
              <div className="relative">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {event.trending && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-primary">{event.price}</span>
                  <Button size="sm" variant="outline">
                    Quick Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
