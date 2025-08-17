import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedListings from "@/components/FeaturedListings";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategorySection />
      <FeaturedListings />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
