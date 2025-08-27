import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user bookings with event and venue details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      events (
        id,
        title,
        start_date,
        end_date,
        category,
        images,
        venues (
          name,
          city,
          state
        )
      ),
      seat_categories (
        name,
        price
      ),
      payments (
        status,
        payment_method,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <UserDashboard user={user} profile={profile} bookings={bookings || []} />
    </div>
  )
}
