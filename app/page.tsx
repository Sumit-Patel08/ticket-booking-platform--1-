import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedEvents } from "@/components/home/featured-events"
import { EventCategories } from "@/components/home/event-categories"
import { PopularEvents } from "@/components/home/popular-events"
import { Footer } from "@/components/layout/footer"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main>
        <HeroSection />
        <EventCategories />
        <FeaturedEvents />
        <PopularEvents />
      </main>
      <Footer />
    </div>
  )
}
