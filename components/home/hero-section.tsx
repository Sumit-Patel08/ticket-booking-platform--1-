"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
            Discover Amazing <span className="text-primary">Events</span> Near You
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
            From concerts and festivals to workshops and conferences, find and book tickets for the best events
            happening around you.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button size="lg" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Find Events
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
            <p className="text-muted-foreground">Book tickets in just a few clicks with our streamlined process</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
            <p className="text-muted-foreground">Join thousands of satisfied customers who trust our platform</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Local & Global</h3>
            <p className="text-muted-foreground">Discover events both in your neighborhood and around the world</p>
          </div>
        </div>
      </div>
    </section>
  )
}
