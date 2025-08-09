import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { CommunityHub } from "@/components/CommunityHub";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  // Mock authentication state - in real app, this would come from Supabase auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Simulate checking auth state
    // In real app: const { data: { user } } = await supabase.auth.getUser();
    const mockUser = localStorage.getItem("mockUser");
    if (mockUser) {
      const userData = JSON.parse(mockUser);
      setIsLoggedIn(true);
      setUserName(userData.name);
    }
  }, []);

  return (
    <div className="min-h-screen bg-accent/5">
      <SEO
        title="TSM Crafts | Handmade Crafts & Crafting Supplies Sri Lanka"
        description="Shop handmade crafts and premium crafting supplies at TSM Crafts: quilling paper, macrame kits, scrapbooking tools, and more. Fast delivery in Sri Lanka."
        keywords={[
          "TSM Crafts",
          "handmade crafts",
          "crafting supplies",
          "quilling paper",
          "macrame kits",
          "scrapbooking",
          "Sri Lanka crafts",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TSM Crafts",
            "url": typeof window !== 'undefined' ? window.location.origin : undefined,
            "logo": "/lovable-uploads/428af5aa-0449-4089-ae11-9a6496c23f77.png",
            "sameAs": []
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "TSM Crafts",
            "url": typeof window !== 'undefined' ? window.location.origin : undefined,
            "potentialAction": {
              "@type": "SearchAction",
              "target": typeof window !== 'undefined' ? `${window.location.origin}/search?q={search_term_string}` : undefined,
              "query-input": "required name=search_term_string"
            }
          }
        ]}
      />
      <Header />
      <main>
        <Hero isLoggedIn={isLoggedIn} userName={userName} />
        <RecommendedProducts isLoggedIn={isLoggedIn} userName={userName} />
        <CommunityHub />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
