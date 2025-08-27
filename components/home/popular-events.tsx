import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, TrendingUp } from "lucide-react"
import Image from "next/image"

const popularEvents = [
  {
    id: 1,
    title: "Jazz Night at Blue Note",
    image: "/jazz-club-with-dim-lighting-and-musicians.png",
    date: "Tonight, 8:00 PM",
    location: "Blue Note, NYC",
    price: "$45",
    trending: true,
  },
  {
    id: 2,
    title: "Food & Wine Festival",
    image: "/outdoor-food-festival-with-vendors-and-people.png",
    date: "This Weekend",
    location: "Pier 17, NYC",
    price: "$35",
    trending: true,
  },
  {
    id: 3,
    title: "Stand-up Comedy Show",
    image: "/comedy-club-stage-with-microphone-and-spotlight.png",
    date: "Tomorrow, 9:00 PM",
    location: "Comedy Cellar, NYC",
    price: "$25",
    trending: false,
  },
  {
    id: 4,
    title: "Art Gallery Opening",
    image: "/modern-art-gallery-with-paintings-and-visitors.png",
    date: "Friday, 6:00 PM",
    location: "MoMA, NYC",
    price: "$20",
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
