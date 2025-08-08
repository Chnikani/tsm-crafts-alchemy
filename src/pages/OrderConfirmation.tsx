import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, Calendar, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  shipping_method: string;
  payment_method: string;
  notes?: string;
  contact_email: string;
  contact_phone: string;
  recipient_name: string;
  created_at: string;
  estimated_delivery?: string;
  tracking_number?: string;
  items: OrderItem[];
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your order.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  const fetchOrder = async () => {
    if (!user || !orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (orderError) throw orderError;
      if (!orderData) {
        setError("Order not found");
        return;
      }

      // Fetch order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          order_id,
          product_id,
          quantity,
          price_per_unit,
          product:products(id, name, images)
        `)
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Calculate estimated delivery date (mock)
      const createdDate = new Date(orderData.created_at);
      let deliveryDays = 7; // default for standard shipping
      
      if (orderData.shipping_method === 'express') {
        deliveryDays = 2;
      } else if (orderData.shipping_method === 'priority') {
        deliveryDays = 4;
      }
      
      const estimatedDelivery = new Date(createdDate);
      estimatedDelivery.setDate(createdDate.getDate() + deliveryDays);

      // Generate a mock tracking number
      const trackingNumber = `TSM${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;

      // Combine the data
      const normalizedItems = (itemsData || []).map((it: any) => ({
        ...it,
        product: Array.isArray(it.product) ? it.product[0] : it.product,
      }));
      setOrder({
        ...orderData,
        items: normalizedItems as OrderItem[],
        estimated_delivery: estimatedDelivery.toISOString().split('T')[0],
        tracking_number: trackingNumber
      });
    } catch (err) {
      console.error('Error fetching order:', err);
      setError("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatShippingMethod = (method: string) => {
    switch (method) {
      case 'express':
        return 'Express Shipping (1-2 business days)';
      case 'priority':
        return 'Priority Shipping (3-5 business days)';
      case 'standard':
      default:
        return 'Standard Shipping (5-7 business days)';
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'paypal':
        return 'PayPal';
      case 'credit_card':
      default:
        return 'Credit Card';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">{error || "Order not found"}</h1>
        <p className="mb-8">We couldn't find the order you're looking for.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Order Confirmation Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date Placed</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="font-medium">${order.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="font-medium">{formatPaymentMethod(order.payment_method)}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Shipping Information */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Recipient</p>
                  <p className="font-medium">{order.recipient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contact</p>
                  <p className="font-medium">{order.contact_email}</p>
                  <p className="font-medium">{order.contact_phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                  <p className="font-medium">{order.shipping_address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipping Method</p>
                  <p className="font-medium">{formatShippingMethod(order.shipping_method)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                  <p className="font-medium">{order.tracking_number || "Not available yet"}</p>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Delivery Timeline</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Order Date</p>
                  </div>
                  <p className="text-sm font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="grow px-2">
                  <div className="h-1 bg-muted-foreground/20 relative">
                    <div className="absolute left-0 top-0 h-1 bg-primary" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                  </div>
                  <p className="text-sm font-medium">
                    {order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString() : "Processing"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start">
                  <div 
                    className="h-16 w-16 rounded bg-muted bg-cover bg-center mr-4 flex-shrink-0" 
                    style={{ backgroundImage: `url(${item.product.images[0]})` }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${item.price_per_unit.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.quantity * item.price_per_unit).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/account/orders">View All Orders</Link>
          </Button>
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;