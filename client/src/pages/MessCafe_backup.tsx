import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, IndianRupee, Utensils, Coffee, Users, Wifi, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MessCafe = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Ensure page starts from top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const messListings = [
    {
      id: 1,
      name: "Homely Kitchen",
      location: "HSR Layout, Delhi",
      rating: 4.6,
      reviews: 89,
      type: "Mess",
      monthlyPrice: 3500,
      dailyPrice: 120,
      cuisine: "North & South Indian",
      mealTypes: ["Breakfast", "Lunch", "Dinner"],
      timings: {
        breakfast: "7:30-9:30 AM",
        lunch: "12:30-2:30 PM", 
        dinner: "7:30-9:30 PM"
      },
      features: ["Veg & Non-Veg", "Home Style", "Fresh Ingredients", "Hygienic"],
      weeklyMenu: true,
      badge: "Popular",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      name: "Spice Garden Cafe",
      location: "Jayanagar, Delhi",
      rating: 4.4,
      reviews: 156,
      type: "Cafe",
      hourlyRate: 50,
      fullDayRate: 300,
      amenities: ["WiFi", "AC", "Work Space", "Charging Points"],
      specialties: ["Coffee", "Snacks", "Continental", "Study Space"],
      timings: {
        opening: "7:00 AM",
        closing: "11:00 PM"
      },
      personalSpace: true,
      badge: "Trending",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      name: "Green Leaf Mess",
      location: "Koramangala, Delhi", 
      rating: 4.8,
      reviews: 234,
      type: "Mess",
      monthlyPrice: 4200,
      dailyPrice: 150,
      cuisine: "Pure Vegetarian",
      mealTypes: ["Breakfast", "Lunch", "Dinner"],
      timings: {
        breakfast: "8:00-10:00 AM",
        lunch: "12:00-2:00 PM",
        dinner: "7:00-9:00 PM"
      },
      features: ["Organic Vegetables", "Jain Food Available", "Oil-Free Options"],
      weeklyMenu: true,
      badge: "Best Rated",
      image: "/api/placeholder/400/300"
    },
    {
      id: 4,
      name: "Coffee Culture",
      location: "Indiranagar, Delhi",
      rating: 4.5,
      reviews: 198,
      type: "Cafe",
      hourlyRate: 75,
      fullDayRate: 400,
      amenities: ["Premium WiFi", "AC", "Private Booths", "Meeting Rooms"],
      specialties: ["Specialty Coffee", "Workspace", "Conference Room"],
      timings: {
        opening: "6:00 AM",
        closing: "12:00 AM"
      },
      personalSpace: true,
      badge: "Premium",
      image: "/api/placeholder/400/300"
    }
  ];

  const filteredListings = activeTab === "all" 
    ? messListings 
    : messListings.filter(listing => listing.type.toLowerCase() === activeTab);

  const badgeColors = {
    "Popular": "bg-secondary text-secondary-foreground",
    "Trending": "bg-warning text-warning-foreground", 
    "Best Rated": "bg-success text-success-foreground",
    "Premium": "bg-accent text-accent-foreground"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-hero py-16 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg">
              Mess & Cafe Services
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover delicious home-style meals and comfortable workspaces
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Search location..." className="bg-white" />
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mess">Mess Service</SelectItem>
                    <SelectItem value="cafe">Cafe & Workspace</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-primary hover:opacity-90">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="mess">Mess</TabsTrigger>
              <TabsTrigger value="cafe">Cafes</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Found {filteredListings.length} Services</h2>
            <p className="text-muted-foreground">Quality food and workspace options</p>
          </div>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative">
                <div className="aspect-[16/10] bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {listing.type === "Mess" ? (
                      <Utensils className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <Coffee className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {/* Badge */}
                <Badge className={`absolute top-4 left-4 ${badgeColors[listing.badge]} font-semibold`}>
                  {listing.badge}
                </Badge>

                {/* Type Badge */}
                <Badge variant="secondary" className="absolute top-4 right-4">
                  {listing.type}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {listing.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <span>{listing.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{listing.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({listing.reviews} reviews)
                  </span>
                </div>

                {/* Service Specific Content */}
                {listing.type === "Mess" ? (
                  <div className="space-y-3">
                    {/* Meal Types */}
                    <div className="flex flex-wrap gap-2">
                      {listing.mealTypes.map((meal, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {meal}
                        </Badge>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {listing.features.slice(0, 3).map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Timings */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div className="text-center">
                        <div className="font-medium">Breakfast</div>
                        <div>{listing.timings.breakfast}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Lunch</div>
                        <div>{listing.timings.lunch}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Dinner</div>
                        <div>{listing.timings.dinner}</div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-lg font-bold text-primary">
                            ₹{listing.monthlyPrice}
                          </div>
                          <div className="text-muted-foreground">per month</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary">
                            ₹{listing.dailyPrice}
                          </div>
                          <div className="text-muted-foreground">per day</div>
                        </div>
                      </div>
                      <Button className="hover-glow">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.slice(0, 4).map((amenity, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {listing.specialties.slice(0, 3).map((specialty, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Timings */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{listing.timings.opening} - {listing.timings.closing}</span>
                      </div>
                      {listing.personalSpace && (
                        <Badge variant="outline" className="text-xs">
                          Personal Space Available
                        </Badge>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-lg font-bold text-primary">
                            ₹{listing.hourlyRate}
                          </div>
                          <div className="text-muted-foreground">per hour</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary">
                            ₹{listing.fullDayRate}
                          </div>
                          <div className="text-muted-foreground">full day</div>
                        </div>
                      </div>
                      <Button className="hover-glow">
                        Book Slot
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Menu Section for Mess */}
        {activeTab === "mess" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16"
          >
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Sample Weekly Menu - Homely Kitchen
                </h3>
                <div className="grid md:grid-cols-7 gap-4">
                  {[
                    { day: "Monday", meals: ["Poha, Tea", "Dal Rice, Sabzi", "Roti, Curry"] },
                    { day: "Tuesday", meals: ["Upma, Coffee", "Sambar Rice", "Chapati, Dal"] },
                    { day: "Wednesday", meals: ["Idli, Chutney", "Curd Rice", "Pulao, Raita"] },
                    { day: "Thursday", meals: ["Paratha, Curd", "Rajma Rice", "Roti, Paneer"] },
                    { day: "Friday", meals: ["Dosa, Sambar", "Biryani", "Chapati, Fish"] },
                    { day: "Saturday", meals: ["Poori, Aloo", "Chicken Rice", "Roti, Mutton"] },
                    { day: "Sunday", meals: ["Pongal, Coffee", "Special Thali", "Fried Rice"] }
                  ].map((day, index) => (
                    <div key={index} className="text-center">
                      <h4 className="font-semibold mb-3 text-primary">{day.day}</h4>
                      <div className="space-y-2">
                        {day.meals.map((meal, i) => (
                          <div key={i} className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                            {meal}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="hover:bg-gradient-primary hover:text-white">
            Load More Services
          </Button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default MessCafe;