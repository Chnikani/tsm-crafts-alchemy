import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HandmadeCollection = () => {
  // Collection items based on the image
  const collectionItems = [
    {
      id: 1,
      name: "Intricate Paper Quilled Earrings",
      description: "Delicate and lightweight earrings made with precision quilling techniques. Each piece is handcrafted with care and features vibrant colors that will complement any outfit.",
      image: "/placeholder.svg",
      link: "/category?category=earrings"
    },
    {
      id: 2,
      name: "Handcrafted Floral Embossed Cards",
      description: "Beautiful greeting cards featuring intricate embossed floral designs. Perfect for special occasions or to send a heartfelt message to someone you care about.",
      image: "/placeholder.svg",
      link: "/category?category=cards"
    },
    {
      id: 3,
      name: "Artisanal Paper Framed Mugs",
      description: "Unique decorative mugs adorned with handcrafted paper art frames. These pieces make wonderful gifts or eye-catching additions to your home decor collection.",
      image: "/placeholder.svg",
      link: "/category?category=mugs"
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="container px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Our Handmade Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite range of handcrafted items, each made with love and attention to detail.
            These unique pieces showcase traditional Sri Lankan craftsmanship with a modern twist.
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {collectionItems.map((item) => (
            <div key={item.id} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-primary/10">
                <img 
                  src={item.image} 
                  alt={item.name}
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

export default HandmadeCollection;