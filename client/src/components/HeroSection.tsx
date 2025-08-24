import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      title: "Find Your Perfect PG & Hostel",
      subtitle: "Comfortable stays with all amenities",
      description: "Discover verified PGs and hostels with WiFi, mess facilities, and more",
      image: "/pg.jpg",
      cta: "Explore PGs",
      route: "/pg-hostels",
    },
    {
      id: 2,
      title: "Delicious Mess & Cafe Options",
      subtitle: "Home-style food and cozy cafes",
      description: "Book mess services or find the perfect cafe for work and relaxation",
      image: "/mess.jpg",
      cta: "Find Food",
      route: "/mess-cafe",
    },
    {
      id: 3,
      title: "Gaming Zones & Sports Areas",
      subtitle: "Entertainment and recreation",
      description: "Book gaming zones, sports facilities, and entertainment venues",
      image: "/gamingcafe.jpg",
      cta: "Book Now",
      route: "/gaming-zone",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = () => {
    if (!searchCategory) {
      // If no category selected, default to PG hostels
      const searchParams = new URLSearchParams();
      if (searchLocation.trim()) {
        searchParams.append('search', searchLocation.trim());
      }
      navigate(`/pg-hostels?${searchParams.toString()}`);
      return;
    }

    // Navigate to the selected category page with search parameters
    const searchParams = new URLSearchParams();
    if (searchLocation.trim()) {
      searchParams.append('search', searchLocation.trim());
    }

    const routeMap: { [key: string]: string } = {
      'pg-hostels': '/pg-hostels',
      'mess-cafe': '/mess-cafe',
      'gaming-zone': '/gaming-zone'
    };

    const route = routeMap[searchCategory] || '/pg-hostels';
    navigate(`${route}?${searchParams.toString()}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="relative h-[calc(100vh-120px)] overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {slides[currentSlide].image.startsWith('/api/placeholder') ? (
              <div className="absolute inset-0 bg-gradient-hero" />
            ) : (
              <img 
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-overlay" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-shadow-lg">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 text-shadow">
                  {slides[currentSlide].subtitle}
                </p>
                <p className="text-lg text-white/80 max-w-md">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 hover-glow"
                onClick={() => {
                  navigate(slides[currentSlide].route);
                  window.scrollTo(0, 0);
                }}
              >
                {slides[currentSlide].cta}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Quick Search */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-large"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">Quick Search</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter city or area" 
                    className="pl-10" 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pg-hostels">PG & Flats</SelectItem>
                    <SelectItem value="mess-cafe">Mess & Cafe</SelectItem>
                    <SelectItem value="gaming-zone">Gaming Zone</SelectItem>
                    {/* <SelectItem value="rooms-flats">Rooms & Flats</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Select date" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Budget</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Max price" className="pl-10" />
                  </div>
                </div>
              </div> */}

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90" 
                size="lg"
                onClick={handleSearch}
              >
                Search Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="text-white hover:bg-white/20 rounded-full p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            className="text-white hover:bg-white/20 rounded-full p-2"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 right-8 z-20"
      >
        <div className="text-white text-center space-y-2">
          <p className="text-sm">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full mx-auto relative"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full absolute left-1/2 top-1 transform -translate-x-1/2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;