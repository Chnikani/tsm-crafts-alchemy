import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  rating?: number;
  reviewCount?: number;
}

interface RecommendedProductsProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export const RecommendedProducts = ({ isLoggedIn = false, userName }: RecommendedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());

  // Mock data - in real app, this would come from Supabase with AI recommendations
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Premium Quilling Paper Set - Rainbow Collection",
      description: "High-quality quilling strips in 12 vibrant colors. Perfect for detailed artwork and decorative pieces.",
      price: 2500,
      images: ["/placeholder.svg", "/placeholder.svg"],
      stockStatus: "In Stock",
      rating: 4.8,
      reviewCount: 24,
    },
    {
      id: "2", 
      name: "Delicate Pink Butterfly Craft Kit",
      description: "Everything you need to create beautiful butterfly decorations. Includes templates, materials, and step-by-step guide.",
      price: 1800,
      images: ["/placeholder.svg"],
      stockStatus: "Low Stock",
      rating: 4.9,
      reviewCount: 18,
    },
    {
      id: "3",
      name: "Professional Crafting Tools Set",
      description: "Complete set of precision tools for advanced crafting projects. Durable and ergonomic design.",
      price: 4200,
      images: ["/placeholder.svg"],
      stockStatus: "In Stock",
      rating: 4.7,
      reviewCount: 35,
    },
    {
      id: "4",
      name: "Beginner's Scrapbooking Starter Pack",
      description: "Perfect introduction to scrapbooking with papers, stickers, and decorative elements.",
      price: 3200,
      images: ["/placeholder.svg"],
      stockStatus: "In Stock",
      rating: 4.6,
      reviewCount: 12,
    },
  ];

  useEffect(() => {
    // Simulate loading recommendations based on user preferences
    setProducts(mockProducts);
  }, []);

  const handleWishlistToggle = (productId: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleInquire = (productId: string) => {
    // In real app, this would log the inquiry and potentially open email/chat
    console.log(`Inquiry for product: ${productId}`);
  };

  const sectionTitle = isLoggedIn && userName 
    ? `Recommended For You, ${userName}` 
    : "Featured Products";

  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              {isLoggedIn ? "AI Powered" : "Curated Selection"}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {sectionTitle}
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isLoggedIn 
              ? "Based on your browsing history and preferences, we've selected these perfect matches for your next creative project."
              : "Discover our most popular and highest-rated crafting supplies, loved by our community of creators."
            }
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistedItems.has(product.id)}
              onWishlistToggle={handleWishlistToggle}
              onInquire={handleInquire}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/products" className="inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};