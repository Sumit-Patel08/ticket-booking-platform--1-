import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Theater, Gamepad2, GraduationCap, Utensils, Camera } from "lucide-react"

const categories = [
  {
    name: "Music & Concerts",
    icon: Music,
    count: "1,234",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    name: "Theater & Arts",
    icon: Theater,
    count: "567",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    name: "Sports & Games",
    icon: Gamepad2,
    count: "890",
    color: "bg-green-500/10 text-green-600",
  },
  {
    name: "Education",
    icon: GraduationCap,
    count: "345",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    name: "Food & Drink",
    icon: Utensils,
    count: "678",
    color: "bg-red-500/10 text-red-600",
  },
  {
    name: "Photography",
    icon: Camera,
    count: "234",
    color: "bg-teal-500/10 text-teal-600",
  },
]

export function EventCategories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore events across different categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div
                    className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 ${category.color} group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} events</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  )
}
