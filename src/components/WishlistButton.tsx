import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  productId: string;
  initialIsWishlisted?: boolean;
  variant?: "icon" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const WishlistButton = ({
  productId,
  initialIsWishlisted = false,
  variant = "icon",
  size = "md",
  className = "",
}: WishlistButtonProps) => {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, productId]);

  const checkWishlistStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();
      
      setIsWishlisted(!!data);
    } catch (err) {
      console.error('Error checking wishlist:', err);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      });
      navigate("/auth", { state: { returnUrl: window.location.pathname } });
      return;
    }

    setIsLoading(true);
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setIsWishlisted(false);
        toast({
          title: "Removed from Wishlist",
          description: "Item has been removed from your wishlist.",
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: productId,
          });

        if (error) throw error;

        setIsWishlisted(true);
        toast({
          title: "Added to Wishlist",
          description: "Item has been added to your wishlist.",
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update your wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: variant === "icon" ? "h-8 w-8" : "h-8 px-3 text-xs",
    md: variant === "icon" ? "h-10 w-10" : "h-10 px-4 text-sm",
    lg: variant === "icon" ? "h-12 w-12" : "h-12 px-5",
  };

  // Icon size
  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`${sizeClasses[size]} ${className} ${isWishlisted ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
        onClick={toggleWishlist}
        disabled={isLoading}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`${iconSize[size]} ${isWishlisted ? "fill-current" : ""}`} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={isWishlisted ? "destructive" : "outline"}
      className={`${sizeClasses[size]} ${className}`}
      onClick={toggleWishlist}
      disabled={isLoading}
    >
      <Heart className={`${iconSize[size]} mr-2 ${isWishlisted ? "fill-current" : ""}`} />
      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
};