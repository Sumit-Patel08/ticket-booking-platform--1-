import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { EventsGrid } from "@/components/events/events-grid"
import { EventsFilters } from "@/components/events/events-filters"
import { EventsSearch } from "@/components/events/events-search"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface SearchParams {
  category?: string
  location?: string
  date?: string
  price?: string
  search?: string
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams

  let events = []
  let databaseError = null

  try {
    // Build query based on search parameters
    let query = supabase
      .from("events")
      .select(`
        *,
        venues (
          name,
          city,
          state,
          country
        ),
        seat_categories (
          name,
          price
        )
      `)
      .eq("status", "published")
      .order("start_date", { ascending: true })

    // Apply filters
    if (params.category) {
      query = query.ilike("category", `%${params.category}%`)
    }

    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching events:", error)
      databaseError = error
    } else {
      events = data || []
    }
  } catch (error) {
    console.error("Database connection error:", error)
    databaseError = error
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover Events</h1>
          <p className="text-muted-foreground">Find amazing events happening near you</p>
        </div>

        {databaseError && (
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">Database Setup Required</AlertTitle>
            <AlertDescription className="text-orange-700">
              The database tables haven't been created yet. Please run the following SQL scripts in order:
              <br />
              <code className="bg-orange-100 px-2 py-1 rounded text-sm mt-2 block">
                1. scripts/001_create_database_schema.sql
                <br />
                2. scripts/002_enable_rls_and_policies.sql
                <br />
                3. scripts/003_create_functions_and_triggers.sql
                <br />
                4. scripts/004_seed_sample_data.sql
              </code>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <EventsFilters />
          </aside>

          <div className="lg:col-span-3">
            <EventsSearch />
            <EventsGrid events={events} />
          </div>
        </div>
      </main>
    </div>
  )
}
