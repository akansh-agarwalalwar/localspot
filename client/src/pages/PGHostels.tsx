import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, MapPin, Star, Wifi, Car, Users, Utensils, Clock, IndianRupee, Eye, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const PGHostels = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([5000, 20000]);

  const listings = [
    {
      id: 1,
      name: "Green Valley PG",
      location: "Koramangala, Bangalore",
      rating: 4.8,
      reviews: 156,
      price: 8500,
      originalPrice: 10000,
      images: ["/api/placeholder/400/300"],
      roomType: "Single",
      acType: "AC",
      amenities: ["WiFi", "RO Water", "Electricity Included", "Mess Included", "Cleaner Available"],
      washroom: "Attached",
      washroomType: "Western",
      gateTimings: "24/7",
      badge: "Best Seller",
      discount: 15,
      verified: true,
    },
    {
      id: 2,
      name: "Elite Boys Hostel",
      location: "Electronic City, Bangalore",
      rating: 4.5,
      reviews: 198,
      price: 7200,
      originalPrice: 8500,
      images: ["/api/placeholder/400/300"],
      roomType: "Double",
      acType: "Non-AC",
      amenities: ["WiFi", "Gym", "Laundry", "Electricity Extra", "Mess Separate"],
      washroom: "Common",
      washroomType: "Indian",
      gateTimings: "6 AM - 11 PM",
      badge: "Top Rated",
      discount: 15,
      verified: true,
    },
    {
      id: 3,
      name: "Comfort Stay PG",
      location: "Whitefield, Bangalore",
      rating: 4.6,
      reviews: 89,
      price: 9500,
      originalPrice: 11000,
      images: ["/api/placeholder/400/300"],
      roomType: "Triple",
      acType: "AC",
      amenities: ["WiFi", "RO Water", "Electricity Included", "Mess Included", "Parking"],
      washroom: "Attached",
      washroomType: "Western",
      gateTimings: "24/7",
      badge: "Popular",
      discount: 14,
      verified: true,
    },
    {
      id: 4,
      name: "Smart Living Hostel",
      location: "HSR Layout, Bangalore",
      rating: 4.7,
      reviews: 234,
      price: 6800,
      originalPrice: 8000,
      images: ["/api/placeholder/400/300"],
      roomType: "Single",
      acType: "Non-AC",
      amenities: ["WiFi", "Security", "Laundry", "Electricity Extra", "Mess Separate"],
      washroom: "Common",
      washroomType: "Indian",
      gateTimings: "6 AM - 10 PM",
      badge: "Budget Friendly",
      discount: 15,
      verified: true,
    },
  ];

  const badgeColors = {
    "Best Seller": "bg-primary text-primary-foreground",
    "Top Rated": "bg-success text-success-foreground",
    "Popular": "bg-secondary text-secondary-foreground",
    "Budget Friendly": "bg-accent text-accent-foreground",
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
              PGs & Hostels in Bangalore
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Find comfortable and affordable accommodations with all modern amenities
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Search location..." className="bg-white" />
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Seater</SelectItem>
                    <SelectItem value="double">Double Seater</SelectItem>
                    <SelectItem value="triple">Triple Seater</SelectItem>
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
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h3>

                {/* Price Range */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium">Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={25000}
                    min={3000}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Room Type</h4>
                  {["Single Seater", "Double Seater", "Triple Seater"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>

                {/* AC Type */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">AC Type</h4>
                  {["AC", "Non-AC"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>

                {/* Amenities */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Amenities</h4>
                  {["WiFi", "RO Water", "Mess Included", "Parking", "Gym", "Laundry"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox id={amenity} />
                      <label htmlFor={amenity} className="text-sm">{amenity}</label>
                    </div>
                  ))}
                </div>

                {/* Washroom Type */}
                <div className="space-y-3">
                  <h4 className="font-medium">Washroom</h4>
                  {["Attached", "Common", "Indian", "Western"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Found {listings.length} PGs & Hostels</h2>
                <p className="text-muted-foreground">Best accommodations in Bangalore</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
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
            </div>

            {/* Listings Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 group"
                >
                  <div className="grid md:grid-cols-3 gap-6 p-6">
                    {/* Image */}
                    <div className="relative">
                      <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                      </div>
                      
                      {/* Badge */}
                      <Badge className={`absolute top-3 left-3 ${badgeColors[listing.badge]} font-semibold`}>
                        {listing.badge}
                      </Badge>
                      
                      {/* Discount */}
                      {listing.discount && (
                        <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-sm px-2 py-1 rounded-full font-semibold">
                          {listing.discount}% OFF
                        </div>
                      )}

                      {/* Image Count */}
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        +8 photos
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                              {listing.name}
                            </h3>
                            {listing.verified && (
                              <Badge variant="outline" className="text-xs text-success border-success">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{listing.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Rating & Details */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{listing.rating}</span>
                          <span className="text-muted-foreground text-sm">({listing.reviews} reviews)</span>
                        </div>
                        <Badge variant="secondary">{listing.roomType}</Badge>
                        <Badge variant="outline">{listing.acType}</Badge>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {listing.amenities.slice(0, 5).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {listing.amenities.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{listing.amenities.length - 5} more
                          </Badge>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Gate: {listing.gateTimings}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{listing.washroom} Washroom</span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
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
                          <span className="text-sm text-muted-foreground">per month</span>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline"
                            onClick={() => navigate(`/pg-details/${listing.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button className="hover-glow">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button size="lg" variant="outline" className="hover:bg-gradient-primary hover:text-white">
                Load More Listings
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PGHostels;