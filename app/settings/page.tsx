import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { UserSettings } from "@/components/settings/user-settings"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <UserSettings user={user} profile={profile} />
    </div>
  )
}
