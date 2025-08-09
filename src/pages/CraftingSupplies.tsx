import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const CraftingSupplies = () => {
  // Supplies items based on the image
  const suppliesItems = [
    {
      id: 1,
      name: "Premium Quilling Paper",
      description: "Our top-tier quilling strips with rich, vibrant colors. Perfect for detailed artwork and decorative pieces. Each pack contains a variety of colors to inspire your creativity.",
      image: "/placeholder.svg",
      link: "/category?category=quilling-paper"
    },
    {
      id: 2,
      name: "Vibrant Acrylic Fabric",
      description: "High-quality acrylic fabric in a range of vivid colors. Ideal for various crafting projects, from clothing to home decor. Durable and easy to work with for crafters of all skill levels.",
      image: "/placeholder.svg",
      link: "/category?category=fabric"
    },
    {
      id: 3,
      name: "DIY Macrame Plant Hangers",
      description: "Complete kits for creating your own stylish macrame plant hangers. Includes premium cotton rope, wooden beads, and detailed instructions. Perfect for adding a touch of handmade charm to your home.",
      image: "/placeholder.svg",
      link: "/category?category=macrame"
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <SEO
        title="Crafting Supplies Collections | TSM Crafts"
        description="Discover curated crafting collections: premium quilling paper, macrame kits, and colorful fabrics. Shop quality supplies at TSM Crafts."
        keywords={["TSM Crafts","crafting collections","quilling","macrame","fabric","DIY supplies"]}
      />
      <Header />
      
      <main className="container px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need to Create
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive selection of high-quality crafting supplies. 
            From essential materials to specialized tools, we have everything you need for your creative projects.
          </p>
        </div>

        {/* Supplies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {suppliesItems.map((item) => (
            <div key={item.id} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-primary/10">
                <img 
                  src={item.image} 
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">{item.id}</h3>
                  <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                </div>
                <p className="text-muted-foreground">{item.description}</p>
                <Button asChild className="w-full">
                  <Link to={item.link}>View Details & Shop</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CraftingSupplies;