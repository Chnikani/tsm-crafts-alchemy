import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
        } else {
          setProduct(data);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleInquire = async () => {
    if (user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, shipping_address, phone_number")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Could not fetch your profile information. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const subject = `Order Inquiry: ${product.name}`;
      const body = `Hello,\n\nI would like to order the following item:\n\nProduct: ${product.name}\nQuantity: ${quantity}\n\nMy details are confirmed as:\n\nName: ${profile.full_name}\nAddress: ${profile.shipping_address}\nPhone: ${profile.phone_number}\n\nPlease send me the invoice and payment details. Thank you.`;
      window.location.href = `mailto:chanierchanika@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      // User is not logged in, handled by the AlertDialog
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.image_url} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-gray-700 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-primary mb-4">${product.price}</p>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-4 font-medium">Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 p-2 border rounded-md"
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" onClick={() => !user && handleInquire()}>Inquire to Order</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Please log in or create an account to place an order.</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/auth")}>Log In</AlertDialogAction>
                  <AlertDialogAction onClick={() => navigate("/auth")}>Sign Up</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};