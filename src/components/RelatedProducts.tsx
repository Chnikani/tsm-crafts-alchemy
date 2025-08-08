import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  rating?: number;
  reviewCount?: number;
  category?: string;
  tags?: string[];
}

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
  tags?: string[];
  limit?: number;
}

export const RelatedProducts = ({
  currentProductId,
  category,
  tags = [],
  limit = 4
}: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4; // Show 4 products at a time on desktop

  // Mock products - in a real app, this would come from Supabase
  const mockProducts = [
    {
      id: "1",
      name: "Premium Quilling Paper Set - Rainbow Collection",
      description: "High-quality quilling strips in 12 vibrant colors. Perfect for detailed artwork and decorative pieces.",
      price: 2500,
      images: ["/placeholder.svg", "/placeholder.svg"],
      stockStatus: "In Stock" as const,
      rating: 4.8,
      reviewCount: 24,
      category: "quilling-paper",
      tags: ["premium", "colorful", "paper"]
    },
    {
      id: "2",
      name: "Handcrafted Floral Embossed Wedding Card",
      description: "Elegant wedding card with intricate floral embossing and premium pearl finish. Includes matching envelope.",
      price: 1200,
      images: ["/placeholder.svg", "/placeholder.svg"],
      stockStatus: "In Stock" as const,
      rating: 4.9,
      reviewCount: 32,
      category: "cards",
      tags: ["premium", "wedding", "paper"]
    },
    {
      id: "3",
      name: "Paper Quilled Butterfly Earrings - Blue",
      description: "Lightweight and colorful butterfly-shaped earrings made with precision quilling techniques. Sterling silver hooks.",
      price: 1800,
      images: ["/placeholder.svg", "/placeholder.svg"],
      stockStatus: "Low Stock" as const,
      rating: 4.7,
      reviewCount: 18,
      category: "earrings",
      tags: ["blue", "butterfly", "jewelry"]
    },
    {
      id: "4",
      name: "Decorative Paper Art Framed Mug - Elephant Design",
      description: "Ceramic mug with handcrafted paper art frame featuring traditional Sri Lankan elephant design. Food-safe and hand-washable.",
      price: 2200,
      images: ["/placeholder.svg", "/placeholder.svg"],
      stockStatus: "In Stock" as const,
      rating: 4.6,
      reviewCount: 15,
      category: "mugs",
      tags: ["elephant", "traditional", "gift"]
    },
    {
      id: "5",
      name: "Vibrant Acrylic Fabric Bundle - Summer Colors",
      description: "Set of 5 high-quality acrylic fabric pieces in bright summer colors. Each piece measures 1m x 1.5m.",
      price: 3500,
      images: ["/placeholder.svg", "/placeholder.svg"],
      stockStatus: "In Stock" as const,
      rating: 4.5,
      reviewCount: 12,
      category: "fabric",
      tags: ["summer", "colorful", "bulk"]
    },
    {
      id: "6",
      name: "DIY Macrame Plant Hanger Kit - Beginner Friendly",
      description: "Complete kit with premium cotton rope, wooden beads, and detailed instructions for creating your own macrame plant hanger.",
      price: 1950,
      images: ["/placeholder.svg", "/placeholder.svg"],
      stockStatus: "In Stock" as const,
      rating: 4.4,
      reviewCount: 9,
      category: "macrame",
      tags: ["beginner", "diy", "kit"]
    }
  ];

  useEffect(() => {
    // In a real app, this would be a database query
    // Filter out the current product and find related products by category or tags
    const filtered = mockProducts.filter(product => {
      if (product.id === currentProductId) return false;
      
      // If category is provided, prioritize same category
      if (category && product.category === category) return true;
      
      // Otherwise check for tag overlap
      if (tags.length > 0 && product.tags) {
        return product.tags.some(tag => tags.includes(tag));
      }
      
      // If no category or tags match, include it anyway if we don't have enough products
      return true;
    });
    
    // Sort by relevance (more matching tags = higher relevance)
    filtered.sort((a, b) => {
      const aTagMatches = a.tags ? a.tags.filter(tag => tags.includes(tag)).length : 0;
      const bTagMatches = b.tags ? b.tags.filter(tag => tags.includes(tag)).length : 0;
      
      return bTagMatches - aTagMatches;
    });
    
    // Limit the number of products
    setRelatedProducts(filtered.slice(0, limit));
  }, [currentProductId, category, tags, limit]);

  const totalPages = Math.ceil(relatedProducts.length / productsPerPage);
  const currentProducts = relatedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={totalPages <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onWishlistToggle={(id) => console.log("Toggle wishlist:", id)}
            onInquire={(id) => console.log("Inquire about:", id)}
          />
        ))}
      </div>
    </div>
  );
};