import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { TimeSlotAvailability } from "@/components/events/time-slot-availability"
import { notFound } from "next/navigation"

export default async function TimeSlotPage({
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
        <TimeSlotAvailability event={event} user={user} />
      </main>
    </div>
  )
}
