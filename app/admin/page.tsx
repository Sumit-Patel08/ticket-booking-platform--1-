import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { redirect } from "next/navigation"

export default async function AdminPage() {
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
    redirect("/setup-admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <AdminDashboard user={user} userRole={profile.role} />
    </div>
  )
}
