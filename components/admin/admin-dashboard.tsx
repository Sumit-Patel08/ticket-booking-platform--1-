import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, DollarSign, TrendingUp, Plus, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface AdminDashboardProps {
  user: User
  userRole: string
}

export function AdminDashboard({ user, userRole }: AdminDashboardProps) {
  // Mock data - in real app, this would come from database
  const stats = {
    totalEvents: 24,
    totalBookings: 1250,
    totalRevenue: 125000,
    activeEvents: 8,
  }

  const recentEvents = [
    {
      id: "1",
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      status: "published",
      bookings: 150,
      revenue: 15000,
    },
    {
      id: "2",
      title: "Tech Innovation Conference",
      date: "2024-08-22",
      status: "published",
      bookings: 89,
      revenue: 26611,
    },
    {
      id: "3",
      title: "Broadway Musical Night",
      date: "2024-09-05",
      status: "draft",
      bookings: 0,
      revenue: 0,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{userRole === "admin" ? "Admin Dashboard" : "Organizer Dashboard"}</h1>
          <p className="text-muted-foreground">Manage your events and track performance</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+25% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEvents}</div>
            <p className="text-xs text-muted-foreground">Currently selling tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {userRole === "admin" && <TabsTrigger value="users">Users</TabsTrigger>}
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant={event.status === "published" ? "default" : "secondary"}>{event.status}</Badge>
                        <span className="text-sm text-muted-foreground">{event.bookings} bookings</span>
                        <span className="text-sm font-medium">${event.revenue.toLocaleString()} revenue</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/events/${event.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Booking management interface would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === "admin" && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </main>
  )
}
