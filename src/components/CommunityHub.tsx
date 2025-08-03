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
  const upcomingWorkshops: Workshop[] = [
    {
      id: "1",
      title: "Quilling Masterclass: Advanced Techniques",
      description: "Learn professional quilling techniques to create stunning decorative pieces and gift items.",
      date: "2024-01-15",
      time: "2:00 PM - 5:00 PM",
      location: "Online",
      maxAttendees: 20,
      currentAttendees: 12,
      status: "Upcoming",
    },
    {
      id: "2",
      title: "Scrapbooking for Beginners",
      description: "Start your scrapbooking journey with basic techniques and creative layout ideas.",
      date: "2024-01-18",
      time: "10:00 AM - 1:00 PM",
      location: "Colombo Studio",
      maxAttendees: 15,
      currentAttendees: 8,
      status: "Upcoming",
    },
    {
      id: "3",
      title: "Paper Flower Making Workshop",
      description: "Create beautiful, lifelike paper flowers for home decoration and special occasions.",
      date: "2024-01-20",
      time: "3:00 PM - 6:00 PM",
      location: "Online",
      maxAttendees: 25,
      currentAttendees: 25,
      status: "Full",
    },
  ];

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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Workshops Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Workshops
              </h3>
              <Button asChild variant="outline" size="sm">
                <Link to="/workshops">View All</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingWorkshops.map((workshop) => (
                <Card key={workshop.id} className="hover:shadow-craft transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{workshop.title}</CardTitle>
                      <Badge variant={getWorkshopBadgeVariant(workshop.status)}>
                        {workshop.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {workshop.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {workshop.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {workshop.currentAttendees}/{workshop.maxAttendees} registered
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={workshop.status === "Full"}
                    >
                      {workshop.status === "Full" ? "Workshop Full" : "Register Interest"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

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