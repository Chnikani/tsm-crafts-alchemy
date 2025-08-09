import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { WishlistButton } from "@/components/WishlistButton";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    category: string;
    stock_quantity: number;
  };
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const user = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          product:product_id(
            id,
            name,
            price,
            description,
            image_url,
            category,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);

      const normalized = (data || []).map((item: any) => ({
        ...item,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
      }));
      setWishlistItems(normalized as WishlistItem[]);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast({
        title: "Error",
        description: "Failed to load your wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistItemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

      if (error) throw error;

      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistItemId));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from your wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/auth", { state: { returnUrl: "/wishlist" } });
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        // Update quantity if already in cart
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item to cart
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: 1,
          });

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to your cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container max-w-7xl mx-auto py-10">
        <PageHeader
          heading="My Wishlist"
          text="Sign in to view and manage your wishlist."
        />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Please sign in to view and manage your wishlist items.
          </p>
          <Button onClick={() => navigate("/auth", { state: { returnUrl: "/wishlist" } })}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <PageHeader
        heading="My Wishlist"
        text="Manage your favorite items and add them to your cart when you're ready to purchase."
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't added any items to your wishlist yet. Browse our products and add your favorites!
          </p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.product.image_url || "/placeholder-product.jpg"}
                  alt={item.product.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 
                    className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <WishlistButton 
                    productId={item.product.id} 
                    initialIsWishlisted={true} 
                  />
                </div>
                <p className="text-xl font-bold mb-2">${item.product.price.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {item.product.description}
                </p>
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => addToCart(item.product.id)}
                    disabled={item.product.stock_quantity < 1}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {item.product.stock_quantity < 1 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}