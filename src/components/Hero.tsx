import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export const Hero = ({ isLoggedIn = false, userName }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30" />
      
      <div className="container relative px-4 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Personalized Greeting */}
          {isLoggedIn && userName && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
              <Heart className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Welcome back, {userName}!</span>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Unleash Your
            <span className="relative">
              <span className="bg-gradient-secondary bg-clip-text text-transparent"> Creative </span>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-secondary animate-pulse" />
            </span>
            Spirit
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover premium crafting supplies, join our vibrant community, and bring your artistic visions to life. 
            From beginners to master crafters - we have everything you need in Sri Lanka.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-warm">
              <Link to="/products" className="inline-flex items-center gap-2">
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/workshops">
                Join Workshops
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-white/70">Premium Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">2000+</div>
              <div className="text-sm text-white/70">Happy Crafters</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm text-white/70">Weekly Workshops</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  );
};