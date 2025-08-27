"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Download, Eye, Heart, Settings, Ticket, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface UserDashboardProps {
  user: User
  profile: any
  bookings: any[]
}

export function UserDashboard({ user, profile, bookings }: UserDashboardProps) {
  const upcomingBookings = bookings.filter((booking) => new Date(booking.events.start_date) > new Date())
  const pastBookings = bookings.filter((booking) => new Date(booking.events.start_date) <= new Date())

  const stats = {
    totalBookings: bookings.length,
    upcomingEvents: upcomingBookings.length,
    totalSpent: bookings.reduce((sum, booking) => sum + Number.parseFloat(booking.total_amount), 0),
    favoriteCategory: "Music", // This would be calculated from booking history
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0].toUpperCase() ||
    "U"

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name || "User"} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name || "User"}!</h1>
            <p className="text-muted-foreground">Manage your bookings and discover new events</p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Category</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteCategory}</div>
            <p className="text-xs text-muted-foreground">Most booked</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">Discover amazing events happening near you</p>
                  <Button asChild>
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
            </CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No past events</h3>
                  <p className="text-muted-foreground">Your event history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">Save events you're interested in to your favorites</p>
                <Button asChild>
                  <Link href="/events">Discover Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="text-sm">{profile?.full_name || "Not provided"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="text-sm">{user.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="text-sm">{profile?.phone || "Not provided"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <div className="text-sm">
                    <Badge variant="secondary">{profile?.role || "customer"}</Badge>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/settings">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total bookings</span>
                  <span className="text-sm font-medium">{stats.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total spent</span>
                  <span className="text-sm font-medium">${stats.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Favorite category</span>
                  <span className="text-sm font-medium">{stats.favoriteCategory}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

interface BookingCardProps {
  booking: any
  isUpcoming: boolean
}

function BookingCard({ booking, isUpcoming }: BookingCardProps) {
  const startDate = new Date(booking.events.start_date)
  const isToday = startDate.toDateString() === new Date().toDateString()
  const daysDiff = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="relative">
        <Image
          src={booking.events.images?.[0] || "/placeholder.svg?height=80&width=120"}
          alt={booking.events.title}
          width={120}
          height={80}
          className="w-20 h-16 object-cover rounded-lg"
        />
        {isToday && <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">Today</Badge>}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold line-clamp-1">{booking.events.title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {booking.events.venues.name}, {booking.events.venues.city}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline">{booking.events.category}</Badge>
          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
          <span className="text-sm text-muted-foreground">
            {booking.quantity} × {booking.seat_categories.name}
          </span>
        </div>
        {isUpcoming && daysDiff > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{daysDiff === 1 ? "Tomorrow" : `In ${daysDiff} days`}</p>
        )}
      </div>

      <div className="text-right">
        <div className="text-lg font-bold">${Number.parseFloat(booking.total_amount).toFixed(2)}</div>
        <div className="text-sm text-muted-foreground">Ref: {booking.booking_reference}</div>
      </div>

      <div className="flex flex-col gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/events/${booking.events.id}`}>
            <Eye className="mr-1 h-3 w-3" />
            View
          </Link>
        </Button>
        <Button size="sm" variant="outline">
          <Download className="mr-1 h-3 w-3" />
          Tickets
        </Button>
      </div>
    </div>
  )
}
