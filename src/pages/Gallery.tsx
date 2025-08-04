import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Heart, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  user_id: string;
  product_id?: string;
  is_approved: boolean;
  created_at: string;
}

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryItems();
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('ugc_gallery')
        .select(`
          id,
          image_url,
          caption,
          user_id,
          product_id,
          is_approved,
          created_at
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery:', error);
      } else {
        setGalleryItems(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload images.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile || !caption.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an image and add a caption.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload image to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // Insert gallery item
      const { error: insertError } = await supabase
        .from('ugc_gallery')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          caption: caption.trim(),
          is_approved: false
        });

      if (insertError) throw insertError;

      toast({
        title: "Upload Successful",
        description: "Your image has been submitted for approval.",
      });

      setCaption("");
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Creative Gallery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Showcase your amazing DIY projects and get inspired by our creative community.
          </p>
          
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Camera className="h-4 w-4 mr-2" />
                  Share Your Creation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Your DIY Creation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Image</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Caption</label>
                    <Textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Tell us about your creation..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile || !caption.trim()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Creation"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-glow transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.caption}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-foreground mb-2 line-clamp-2">
                  {item.caption}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Creative Crafter</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No creations yet</h3>
            <p className="text-muted-foreground">Be the first to share your amazing DIY project!</p>
          </div>
        )}
      </div>
    </div>
  );
};