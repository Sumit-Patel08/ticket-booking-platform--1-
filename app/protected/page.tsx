import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p>You are successfully authenticated!</p>
      <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">{JSON.stringify(data.user, null, 2)}</pre>
    </div>
  )
}
