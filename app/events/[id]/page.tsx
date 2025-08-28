import { Header } from "@/components/layout/header"
import { EventDetails } from "@/components/events/event-details"
import { EventBookingCard } from "@/components/events/event-booking-card"
import { notFound } from "next/navigation"

// Mock data for our events since database isn't set up yet
const mockEvents = {
  "660e8400-e29b-41d4-a716-446655440001": {
    id: "660e8400-e29b-41d4-a716-446655440001",
    title: "Aditya Ghadvi Live Concert in Ahmedabad",
    description: "Experience the soulful voice of Aditya Ghadvi live in concert. Join us for an evening of Gujarati folk music, devotional songs, and contemporary hits that will touch your heart. This is a once-in-a-lifetime opportunity to witness the magic of Aditya Ghadvi's music in the magnificent Sardar Patel Stadium.",
    category: "Music",
    start_date: "2024-09-15T19:00:00+00:00",
    end_date: "2024-09-15T23:00:00+00:00",
    status: "published",
    base_price: 999,
    total_seats: 50000,
    available_seats: 48500,
    images: ["/jazz-club-with-dim-lighting-and-musicians.jpg"],
    tags: ["music", "gujarati", "folk", "devotional", "live"],
    featured: true,
    venues: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Sardar Patel Stadium",
      address: "Motera, Ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      capacity: 132000,
      description: "World's largest cricket stadium, also hosts major concerts and events",
      amenities: ["Parking", "Concessions", "Accessibility", "VIP Lounges", "Air Conditioning"]
    },
    seat_categories: [
      {
        id: "770e8400-e29b-41d4-a716-446655440001",
        name: "General Pass",
        price: 999,
        available_seats: 34000,
        total_seats: 35000,
        description: "General admission with access to main concert area"
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440002",
        name: "Premium Pass",
        price: 1999,
        available_seats: 9500,
        total_seats: 10000,
        description: "Premium seating area with better view and complimentary refreshments"
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440003",
        name: "VIP Pass",
        price: 4999,
        available_seats: 5000,
        total_seats: 5000,
        description: "VIP experience with front row seating, meet & greet, and exclusive merchandise"
      }
    ]
  },
  "660e8400-e29b-41d4-a716-446655440002": {
    id: "660e8400-e29b-41d4-a716-446655440002",
    title: "Akash Gupta Standup Comedy in Mumbai",
    description: "Get ready to laugh until your stomach hurts! Akash Gupta brings his hilarious standup comedy show to Mumbai. Known for his witty observations and relatable humor, Akash will take you on a comedy journey that you'll remember for years to come. Don't miss this opportunity to witness one of India's finest comedians live!",
    category: "Comedy",
    start_date: "2024-09-22T20:00:00+00:00",
    end_date: "2024-09-22T22:30:00+00:00",
    status: "published",
    base_price: 799,
    total_seats: 6000,
    available_seats: 5800,
    images: ["/comedy-club-stage-with-microphone-and-spotlight.png"],
    tags: ["comedy", "standup", "humor", "entertainment"],
    featured: true,
    venues: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "NSCI Dome",
      address: "Worli Sports Club, Dr. Annie Besant Road",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      capacity: 8000,
      description: "Premier indoor entertainment venue in Mumbai",
      amenities: ["Parking", "Food Court", "Accessibility", "Premium Seating"]
    },
    seat_categories: [
      {
        id: "770e8400-e29b-41d4-a716-446655440004",
        name: "Standard Pass",
        price: 799,
        available_seats: 3800,
        total_seats: 4000,
        description: "Standard seating with full show access"
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440005",
        name: "Premium Pass",
        price: 1299,
        available_seats: 1500,
        total_seats: 1500,
        description: "Premium seating with better view and complimentary snacks"
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440006",
        name: "VIP Pass",
        price: 2499,
        available_seats: 500,
        total_seats: 500,
        description: "VIP seating with meet & greet and exclusive photo opportunity"
      }
    ]
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Get event from mock data
  const event = mockEvents[id as keyof typeof mockEvents]

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>

          <div className="lg:col-span-1">
            <EventBookingCard event={event} user={null} />
          </div>
        </div>
      </main>
    </div>
  )
}
