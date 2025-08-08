import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Grid, List, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryProducts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Category mapping for display names
  const categoryDisplayNames: Record<string, string> = {
    "earrings": "Intricate Paper Quilled Earrings",
    "cards": "Handcrafted Floral Embossed Cards",
    "mugs": "Artisanal Paper Framed Mugs",
    "quilling-paper": "Premium Quilling Paper",
    "fabric": "Vibrant Acrylic Fabric",
    "macrame": "DIY Macrame Plant Hangers"
  };

  const categoryDescriptions: Record<string, string> = {
    "earrings": "Delicate and lightweight earrings made with precision quilling techniques. Each piece is handcrafted with care and features vibrant colors.",
    "cards": "Beautiful greeting cards featuring intricate embossed floral designs. Perfect for special occasions or to send a heartfelt message.",
    "mugs": "Unique decorative mugs adorned with handcrafted paper art frames. These pieces make wonderful gifts or eye-catching additions to your home.",
    "quilling-paper": "Our top-tier quilling strips with rich, vibrant colors. Perfect for detailed artwork and decorative pieces.",
    "fabric": "High-quality acrylic fabric in a range of vivid colors. Ideal for various crafting projects, from clothing to home decor.",
    "macrame": "Complete kits for creating your own stylish macrame plant hangers. Includes premium cotton rope, wooden beads, and detailed instructions."
  };

  const tags = [
    "beginner", "advanced", "colorful", "white", "pink", "blue", 
    "eco-friendly", "premium", "bulk", "starter-kit"
  ];

  // Mock products - in a real app, this would come from Supabase filtered by category
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
      category: "quilling-paper"
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
      category: "cards"
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
      category: "earrings"
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
      category: "mugs"
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
      category: "fabric"
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
      category: "macrame"
    }
  ];

  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    // Filter products by category and other filters
    let filtered = mockProducts.filter(product => {
      // Filter by category if provided
      const matchesCategory = categoryParam ? product.category === categoryParam : true;
      
      // Filter by search query
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by price range
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for "featured"
        break;
    }

    setFilteredProducts(filtered);
  }, [categoryParam, searchQuery, selectedTags, priceRange, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setPriceRange([0, 10000]);
    setSearchQuery("");
    setSortBy("featured");
  };

  const getCategoryTitle = () => {
    if (!categoryParam) return "All Products";
    return categoryDisplayNames[categoryParam] || categoryParam;
  };

  const getCategoryDescription = () => {
    if (!categoryParam) return "Discover our complete collection of premium crafting supplies";
    return categoryDescriptions[categoryParam] || "";
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="container px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getCategoryTitle()}
          </h1>
          <p className="text-muted-foreground">
            {getCategoryDescription()}
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              {(selectedTags.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-4 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range (LKR)</h3>
                  <div className="space-y-3">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>LKR {priceRange[0].toLocaleString()}</span>
                      <span>LKR {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} products
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onWishlistToggle={(id) => console.log("Toggle wishlist:", id)}
                    onInquire={(id) => console.log("Inquire about:", id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-48 h-48 flex-shrink-0">
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex justify-between">
                          <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-muted-foreground">{product.description}</p>
                            <div className="text-xl font-bold text-primary">
                              LKR {product.price.toLocaleString()}
                            </div>
                            <Badge variant="outline">{product.stockStatus}</Badge>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm">Inquire to Order</Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/product/${product.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryProducts;