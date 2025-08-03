import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { CommunityHub } from "@/components/CommunityHub";
import { Footer } from "@/components/Footer";

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
    <div className="min-h-screen bg-background">
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
