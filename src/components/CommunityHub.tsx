import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  status: "Upcoming" | "Full" | "Completed";
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  userName: string;
  productUsed?: string;
}

export const CommunityHub = () => {
  // Mock data - in real app, this would come from Supabase

  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      imageUrl: "/placeholder.svg",
      caption: "My first quilling butterfly! So proud of how it turned out 🦋",
      userName: "Priya S.",
      productUsed: "Rainbow Quilling Set",
    },
    {
      id: "2",
      imageUrl: "/placeholder.svg",
      caption: "Wedding invitation cards made with love using YSM supplies",
      userName: "Amal K.",
      productUsed: "Premium Card Stock",
    },
    {
      id: "3",
      imageUrl: "/placeholder.svg",
      caption: "Children's room decoration - paper flowers everywhere!",
      userName: "Nisha M.",
      productUsed: "Tissue Paper Set",
    },
    {
      id: "4",
      imageUrl: "/placeholder.svg",
      caption: "Handmade birthday card for my mom ❤️",
      userName: "Kavya R.",
    },
  ];

  const getWorkshopBadgeVariant = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "default";
      case "Full":
        return "secondary";
      case "Completed":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join Our Creative Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow crafters, learn new skills in our workshops, and share your amazing creations with the world.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Customer Gallery Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Customer Creations
              </h3>
              <Button asChild variant="outline" size="sm">
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-craft transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-foreground mb-1 line-clamp-2">
                      {item.caption}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {item.userName}
                    </p>
                    {item.productUsed && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.productUsed}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link to="/gallery/submit" className="inline-flex items-center gap-2">
                  Share Your Creation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};