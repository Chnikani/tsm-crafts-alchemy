import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Star, ArrowLeft, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } = "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  status: string;
  is_featured: boolean;
  tags: string[];
  product_images: Array<{
    image_url: string;
    display_order: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    review_text: string;
    created_at: string;
    profiles: {
      full_name: string;
    };
  }>;
}

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      getUser();
    }
  }, [id]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user && id) {
      checkWishlistStatus(user.id, id);
    }
  };

  const checkWishlistStatus = async (userId: string, productId: string) => {
    const { data } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    
    setIsWishlisted(!!data);
  };

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (image_url, display_order),
        reviews!inner (
          id,
          rating,
          review_text,
          created_at,
          profiles (full_name)
        )
      `)
      .eq('id', id)
      .eq('reviews.is_approved', true)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isWishlisted) {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (!error) {
        setIsWishlisted(false);
        toast({ title: "Removed from wishlist" });
      }
    } else {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: id
        });

      if (!error) {
        setIsWishlisted(true);
        toast({ title: "Added to wishlist" });
      }
    }
  };

  const handleInquire = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order inquiry.",
        variant: "destructive",
      });
      return;
    }

    // Log the order inquiry
    const { error } = await supabase
      .from('order_inquiries')
      .insert({
        user_id: user.id,
        product_id: id,
        quantity: quantity
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inquiry Submitted",
        description: `Your inquiry for ${quantity} x ${product?.name} has been submitted. We'll contact you via email shortly.`,
      });
    }
  };

  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case "In Stock": return "default";
      case "Low Stock": return "secondary";
      case "Out of Stock": return "destructive";
      default: return "default";
    }
  };

  const averageRating = product?.reviews?.length 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = product.product_images.sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container px-4">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted/50">
              <img
                src={images[currentImageIndex]?.image_url || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWishlistToggle}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={getStockBadgeVariant(product.status)}>
                  {product.status}
                </Badge>
                
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-3xl font-bold text-primary mb-4">
                LKR {product.price.toLocaleString()}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Quantity and Order */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock_quantity) {
                        setQuantity(val);
                      }
                    }}
                    className="w-20 text-center"
                    min={1}
                    max={product.stock_quantity}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {product.stock_quantity} available
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={handleInquire}
                disabled={product.status === "Out of Stock"}
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Inquire to Order
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            <div className="grid gap-4">
              {product.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-semibold text-foreground">{review.profiles.full_name}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{review.review_text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};