import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  rating?: number;
  reviewCount?: number;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onInquire?: (id: string) => void;
}

export const ProductCard = ({
  id,
  name,
  description,
  price,
  images,
  stockStatus,
  rating = 0,
  reviewCount = 0,
  isWishlisted = false,
  onWishlistToggle,
  onInquire,
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default";
      case "Low Stock":
        return "secondary";
      case "Out of Stock":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleImageHover = () => {
    if (images.length > 1) {
      setIsImageHovered(true);
      setCurrentImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setIsImageHovered(false);
    setCurrentImageIndex(0);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-craft hover:shadow-glow transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div 
          className="aspect-square overflow-hidden bg-muted/50"
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
        >
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Stock Badge */}
        <Badge 
          variant={getStockBadgeVariant(stockStatus)}
          className="absolute top-2 left-2"
        >
          {stockStatus}
        </Badge>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={() => onWishlistToggle?.(id)}
        >
          <Heart 
            className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
          />
        </Button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link to={`/products/${id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        {/* Product Name */}
        <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="text-lg font-bold text-primary">
          LKR {price.toLocaleString()}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full"
          onClick={() => onInquire?.(id)}
          disabled={stockStatus === "Out of Stock"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Inquire to Order
        </Button>
      </CardFooter>
    </Card>
  );
};