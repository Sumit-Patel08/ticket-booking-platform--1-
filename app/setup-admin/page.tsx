import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SetupAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user already has admin role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  const handleMakeAdmin = async () => {
    "use server"
    
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Update user role to admin
    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        role: "admin"
      })

    redirect("/admin")
  }

  const handleMakeOrganizer = async () => {
    "use server"
    
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Update user role to organizer
    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        role: "organizer"
      })

    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Setup Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Current role: <span className="font-medium">{profile?.role || "customer"}</span>
            </p>
            
            {profile?.role === "admin" ? (
              <div className="text-center">
                <p className="text-green-600 mb-4">✓ You already have admin access!</p>
                <Button asChild>
                  <a href="/admin">Go to Admin Dashboard</a>
                </Button>
              </div>
            ) : profile?.role === "organizer" ? (
              <div className="text-center">
                <p className="text-blue-600 mb-4">✓ You have organizer access!</p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <a href="/admin">Go to Admin Dashboard</a>
                  </Button>
                  <form action={handleMakeAdmin}>
                    <Button type="submit" variant="outline" className="w-full">
                      Upgrade to Admin
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm">Choose your role to access the admin panel:</p>
                <form action={handleMakeAdmin}>
                  <Button type="submit" className="w-full">
                    Make me Admin
                  </Button>
                </form>
                <form action={handleMakeOrganizer}>
                  <Button type="submit" variant="outline" className="w-full">
                    Make me Organizer
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Admin: Full access to all features<br/>
                  Organizer: Can manage events and bookings
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
