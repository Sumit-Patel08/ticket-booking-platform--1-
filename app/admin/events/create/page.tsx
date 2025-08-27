import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { EventCreateForm } from "@/components/admin/event-create-form"
import { redirect } from "next/navigation"

export default async function CreateEventPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has admin or organizer role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "organizer"].includes(profile.role)) {
    redirect("/")
  }

  // Fetch venues for the form
  const { data: venues } = await supabase.from("venues").select("*").order("name")

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details to create your event</p>
          </div>
          <EventCreateForm venues={venues || []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
