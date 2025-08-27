import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { BookingFlow } from "@/components/booking/booking-flow"
import { redirect, notFound } from "next/navigation"

export default async function BookEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ category?: string; quantity?: string }>
}) {
  const { id } = await params
  const { category, quantity } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch event details with seat categories
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
        country
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

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <BookingFlow
          event={event}
          user={user}
          profile={profile}
          initialCategory={category}
          initialQuantity={quantity ? Number.parseInt(quantity) : 1}
        />
      </main>
    </div>
  )
}
