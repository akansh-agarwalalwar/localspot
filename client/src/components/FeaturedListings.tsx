import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Car, Users, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const FeaturedListings = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "pg", label: "PGs & Hostels" },
    { id: "mess", label: "Mess & Cafes" },
    { id: "gaming", label: "Gaming Zones" },
    { id: "rooms", label: "Rooms & Flats" },
  ];

  const listings = [
    {
      id: 1,
      category: "pg",
      title: "Green Valley PG",
      location: "Koramangala, Bangalore",
      rating: 4.8,
      reviews: 156,
      price: 8500,
      originalPrice: 10000,
      image: "/api/placeholder/400/300",
      type: "PG",
      features: ["WiFi", "AC", "Mess", "Parking"],
      badge: "Best Seller",
      discount: 15,
    },
    {
      id: 2,
      category: "mess",
      title: "Homely Kitchen",
      location: "HSR Layout, Bangalore",
      rating: 4.6,
      reviews: 89,
      price: 3500,
      originalPrice: 4000,
      image: "/api/placeholder/400/300",
      type: "Mess",
      features: ["Veg", "Home Style", "Daily Menu"],
      badge: "Popular",
      discount: 12,
    },
    {
      id: 3,
      category: "gaming",
      title: "GameZone Pro",
      location: "Indiranagar, Bangalore",
      rating: 4.9,
      reviews: 234,
      price: 100,
      originalPrice: 120,
      image: "/api/placeholder/400/300",
      type: "Gaming",
      features: ["PS5", "PC Gaming", "VR", "AC"],
      badge: "New",
      discount: 17,
    },
    {
      id: 4,
      category: "rooms",
      title: "Cozy Studio Apartment",
      location: "Whitefield, Bangalore",
      rating: 4.7,
      reviews: 67,
      price: 15000,
      originalPrice: 18000,
      image: "/api/placeholder/400/300",
      type: "Room",
      features: ["Furnished", "Kitchen", "Balcony"],
      badge: "Premium",
      discount: 17,
    },
    {
      id: 5,
      category: "pg",
      title: "Elite Boys Hostel",
      location: "Electronic City, Bangalore",
      rating: 4.5,
      reviews: 198,
      price: 7200,
      originalPrice: 8500,
      image: "/api/placeholder/400/300",
      type: "Hostel",
      features: ["WiFi", "Gym", "Laundry"],
      badge: "Top Rated",
      discount: 15,
    },
    {
      id: 6,
      category: "mess",
      title: "Spice Garden Cafe",
      location: "Jayanagar, Bangalore",
      rating: 4.4,
      reviews: 156,
      price: 250,
      originalPrice: 300,
      image: "/api/placeholder/400/300",
      type: "Cafe",
      features: ["WiFi", "AC", "Work Space"],
      badge: "Trending",
      discount: 17,
    },
  ];

  const filteredListings = activeCategory === "all" 
    ? listings 
    : listings.filter(listing => listing.category === activeCategory);

  const badgeColors = {
    "Best Seller": "bg-primary text-primary-foreground",
    "Popular": "bg-secondary text-secondary-foreground",
    "New": "bg-accent text-accent-foreground",
    "Premium": "bg-gradient-primary text-white",
    "Top Rated": "bg-success text-success-foreground",
    "Trending": "bg-warning text-warning-foreground",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Listings
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Handpicked accommodations and services with the best ratings and reviews
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`transition-all duration-300 ${
                  activeCategory === category.id 
                    ? "bg-gradient-primary text-white" 
                    : "hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Listings Grid */}
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredListings.map((listing) => (
            <motion.div
              key={listing.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                
                {/* Badge */}
                <Badge 
                  className={`absolute top-4 left-4 ${badgeColors[listing.badge]} font-semibold`}
                >
                  {listing.badge}
                </Badge>

                {/* Discount */}
                {listing.discount && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-sm px-2 py-1 rounded-full font-semibold">
                    {listing.discount}% OFF
                  </div>
                )}

                {/* Image Gallery Indicators */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  <span>8 photos</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {listing.type}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{listing.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({listing.reviews} reviews)
                  </span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ₹{listing.price.toLocaleString()}
                      </span>
                      {listing.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{listing.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {listing.type === "Gaming" ? "per hour" : "per month"}
                    </span>
                  </div>
                  <Button className="hover-glow">
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="hover:bg-gradient-primary hover:text-white">
            View All Listings
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedListings;