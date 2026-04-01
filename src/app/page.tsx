import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Compass, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Mapper</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/explore">
              <Button variant="ghost">Explore</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Find Your Tribe,
              <br />
              <span className="text-primary">Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover local groups and clubs that match your interests. 
              Search by category or location to find communities in your area.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/explore">
                <Button size="lg" className="gap-2">
                  <Compass className="h-5 w-5" />
                  Explore Groups
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="gap-2">
                  Create a Group
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Search by Location</h3>
                <p className="text-muted-foreground">
                  Find groups within your preferred radius. Whether you&apos;re at home or traveling.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Filter by Interest</h3>
                <p className="text-muted-foreground">
                  Browse categories like Sports, Music, Tech, or Art. Find exactly what excites you.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Join & Connect</h3>
                <p className="text-muted-foreground">
                  Become a member with one click. Attend events and meet like-minded people.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Create your free account and start exploring groups in your area today.
            </p>
            <Link href="/sign-up">
              <Button size="lg">Join Mapper</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mapper. Built with Next.js, Clerk, and MapCN.</p>
        </div>
      </footer>
    </div>
  );
}
