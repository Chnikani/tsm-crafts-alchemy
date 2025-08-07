import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Package, Plus, Edit, Trash2, Eye, Reply } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Admin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    section_id: "",
    tags: "",
    stock_quantity: "",
    status: "In Stock",
    is_featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [messagesRes, productsRes, sectionsRes] = await Promise.all([
        supabase.from('contact_messages').select('*').order('received_at', { ascending: false }),
        supabase.from('products').select('*, product_images(*)').order('created_at', { ascending: false }),
        supabase.from('sections').select('*').order('name')
      ]);

      if (messagesRes.data) setMessages(messagesRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (sectionsRes.data) setSections(sectionsRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
      
      toast({
        title: "Success",
        description: "Message status updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive"
      });
    }
  };

  const addProduct = async () => {
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
        tags: newProduct.tags ? newProduct.tags.split(',').map(tag => tag.trim()) : []
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully"
      });

      setNewProduct({
        name: "",
        description: "",
        price: "",
        section_id: "",
        tags: "",
        stock_quantity: "",
        status: "In Stock",
        is_featured: false
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    }
  };

  const updateProductStatus = async (productId: string, status: string) => {
    try {
      await supabase
        .from('products')
        .update({ status })
        .eq('id', productId);
      
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, status } : product
      ));
      
      toast({
        title: "Success",
        description: "Product status updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-craft">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-craft">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Manage your TSM Crafts store with ease
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="messages" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-colorful">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages ({messages.length})
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="shadow-colorful">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient">Customer Messages</CardTitle>
                <CardDescription>Manage and respond to customer inquiries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{message.sender_name}</h4>
                          <p className="text-sm text-muted-foreground">{message.sender_email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={message.status === 'New' ? 'destructive' : 
                                   message.status === 'In Progress' ? 'default' : 'secondary'}
                          >
                            {message.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.received_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-foreground mb-4">{message.message_text}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateMessageStatus(message.id, 'In Progress')}
                        >
                          Mark In Progress
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateMessageStatus(message.id, 'Replied')}
                        >
                          Mark Replied
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-colorful">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient">Product Management</CardTitle>
                <CardDescription>Manage your product inventory and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product.id} className="shadow-warm">
                      <CardContent className="p-4">
                        {product.product_images?.[0] && (
                          <img 
                            src={product.product_images[0].image_url} 
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                        )}
                        <h4 className="font-semibold mb-2">{product.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-primary">${product.price}</span>
                          <Badge variant={product.status === 'In Stock' ? 'default' : 'destructive'}>
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Stock: {product.stock_quantity}
                        </p>
                        <div className="flex gap-2">
                          <Select onValueChange={(value) => updateProductStatus(product.id, value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                              <SelectItem value="Discontinued">Discontinued</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product" className="space-y-6">
            <Card className="shadow-colorful">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient">Add New Product</CardTitle>
                <CardDescription>Create a new product listing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Select onValueChange={(value) => setNewProduct(prev => ({ ...prev, section_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock_quantity: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="handmade, crafts, diy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => setNewProduct(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Product status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={addProduct}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  size="lg"
                >
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}