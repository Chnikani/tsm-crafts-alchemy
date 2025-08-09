import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock_quantity: number;
  };
}

interface ShoppingCartProps {
  onCartUpdate?: () => void;
}

export const ShoppingCart = ({ onCartUpdate }: ShoppingCartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const supabase = useSupabaseClient();
  const user = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          user_id,
          quantity,
          created_at,
          product:products(id, name, price, images, stock_quantity)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Normalize product as object (not array) for typing safety
      const normalized = (data || []).map((item: any) => ({
        ...item,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
      }));
      const typedData = normalized as CartItem[];
      setCartItems(typedData);
      setCartCount(typedData.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load your cart items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (cartItemId: string, newQuantity: number) => {
    if (!user) return;
    
    if (newQuantity <= 0) {
      await removeCartItem(cartItemId);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Update cart count
      setCartCount(prevCount => {
        const item = cartItems.find(item => item.id === cartItemId);
        const oldQuantity = item ? item.quantity : 0;
        return prevCount - oldQuantity + newQuantity;
      });

      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = async (cartItemId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      const removedItem = cartItems.find(item => item.id === cartItemId);
      const removedQuantity = removedItem ? removedItem.quantity : 0;
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      setCartCount(prevCount => prevCount - removedQuantity);

      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });

      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user || cartItems.length === 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      setCartCount(0);

      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });

      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear your cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <CartIcon className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Your Shopping Cart</SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <CartIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-muted-foreground mb-6">Add items to your cart to see them here</p>
            <Button onClick={() => {
              setIsOpen(false);
              navigate('/');
            }}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-start p-4">
                      <div 
                        className="h-16 w-16 rounded bg-muted bg-cover bg-center mr-4 flex-shrink-0" 
                        style={{ backgroundImage: `url(${item.product.images[0]})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          ${item.product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= item.product.stock_quantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeCartItem(item.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  onClick={proceedToCheckout}
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/wishlist');
                  }}
                  className="w-full"
                >
                  View Wishlist
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={clearCart}
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full text-muted-foreground hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};