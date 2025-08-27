import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { EventDetails } from "@/components/events/event-details"
import { EventBookingCard } from "@/components/events/event-booking-card"
import { notFound } from "next/navigation"

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch event details with related data
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      venues (
        id,
        name,
        address,
        city,
        state,
        country,
        capacity,
        description,
        amenities
      ),
      seat_categories (
        id,
        name,
        price,
        available_seats,
        total_seats,
        description
      )
    `)
    .eq("id", id)
    .eq("status", "published")
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>

          <div className="lg:col-span-1">
            <EventBookingCard event={event} user={user} />
          </div>
        </div>
      </main>
    </div>
  )
}
