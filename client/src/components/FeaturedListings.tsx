import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Car, Users, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { propertyAPI } from "@/services/api";
import { Property } from "@/types";
import PropertyImage from "@/components/common/PropertyImage";
import { useNavigate } from "react-router-dom";

const FeaturedListings = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "pg", label: "PGs & Flats" },
    { id: "mess", label: "Mess & Cafes" },
    { id: "gaming", label: "Gaming Zones" },
    // { id: "rooms", label: "Rooms & Flats" },
  ];

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyAPI.getAllProperties({ limit: 6 }); // Limit to 6 for featured section
        setProperties(response.data.properties || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties by category (for now showing all since we don't have category in backend)
  const filteredProperties = activeCategory === "all" ? properties : properties;

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
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500">Check back later for new listings.</p>
              </div>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <motion.div
                key={property._id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] bg-muted relative">
                    {/* Prioritize cover photo, fallback to first pic */}
                    {(property.coverPhoto || (property.pics && property.pics.length > 0)) ? (
                      <PropertyImage 
                        src={property.coverPhoto || property.pics[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Badge */}
                  <Badge 
                    className="absolute top-4 left-4 bg-primary text-primary-foreground font-semibold"
                  >
                    Featured
                  </Badge>

                  {/* Image Gallery Indicators - Count total photos */}
                  {(() => {
                    const totalPhotos = (property.coverPhoto ? 1 : 0) + 
                                      (property.facilityPhotos?.length || 0) + 
                                      (property.pics?.length || 0);
                    return totalPhotos > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        <span>{totalPhotos} photos</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      PG
                    </Badge>
                  </div>

                  {/* Rating - Using dummy data since not in backend */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.5</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      (120+ reviews)
                    </span>
                  </div>

                  {/* Features - Using dummy data since not in backend */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["WiFi", "AC", "Mess", "Parking"].map((feature, index) => (
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
                          ₹{property.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        per month
                      </span>
                    </div>
                    <Button 
                      className="hover-glow"
                      onClick={() => navigate(`/pg-details/${property._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg" 
            variant="outline" 
            className="hover:bg-gradient-primary hover:text-white"
            onClick={() => navigate('/pg-hostels')}
          >
            View All Listings
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedListings;