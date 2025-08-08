import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, Package, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrderInquiry {
  id: string;
  inquiry_date: string;
  status?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function Orders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        fetchOrders(user.id);
      } else {
        // Redirect to login if not authenticated
        toast({
          title: "Authentication Required",
          description: "Please sign in to view your orders.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    getUser();
  }, [navigate, toast]);

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_inquiries')
        .select(`
          id,
          inquiry_date,
          quantity,
          product:product_id (id, name, price)
        `)
        .eq('user_id', userId)
        .order('inquiry_date', { ascending: false });

      if (error) throw error;

      const normalized = (data || []).map((d: any) => ({
        id: d.id,
        inquiry_date: d.inquiry_date,
        quantity: d.quantity,
        status: d.status,
        product: {
          id: d.product?.id,
          name: d.product?.name,
          price: Number(d.product?.price),
        },
      })) as OrderInquiry[];

      setOrders(normalized);

      // Fetch first images for these products in a single query
      const productIds = Array.from(new Set(normalized.map(o => o.product?.id).filter(Boolean))) as string[];
      if (productIds.length) {
        const { data: imgs } = await supabase
          .from('product_images')
          .select('product_id, image_url, display_order')
          .in('product_id', productIds)
          .order('display_order', { ascending: true });

        const map: Record<string, string> = {};
        imgs?.forEach((img: any) => {
          if (!map[img.product_id]) map[img.product_id] = img.image_url;
        });
        setProductImages(map);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Processing": return "default";
    case "Shipped": return "default";
    case "Delivered": return "outline";
    case "Cancelled": return "destructive";
    case "Pending":
    default: return "secondary";
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Your Orders</h1>
            <p className="text-muted-foreground">View and track your order inquiries</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-6">You haven't placed any order inquiries yet.</p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {currentOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <Clock className="h-3 w-3" />
  <span>{formatDate(order.inquiry_date)}</span>
</div>
                    </div>
<Badge variant={getStatusBadgeVariant(order.status || "Pending")}>
  {order.status || "Pending"}
</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={productImages[order.product?.id || ""] || "/placeholder.svg"}
                        alt={order.product?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{order.product?.name}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div>Quantity: {order.quantity}</div>
                        <div>Price: LKR {order.product?.price.toLocaleString()}</div>
                        <div>Total: LKR {(order.product?.price * order.quantity).toLocaleString()}</div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/product/${order.product?.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Product
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}