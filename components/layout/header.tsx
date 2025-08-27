import { AuthButton } from "@/components/auth/auth-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TicketHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
              Events
            </Link>
            <Link href="/venues" className="text-sm font-medium hover:text-primary transition-colors">
              Venues
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 min-w-[300px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, venues, or artists..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="sm" className="h-7">
              Search
            </Button>
          </div>

          <AuthButton user={user} />
        </div>
      </div>
    </header>
  )
}
