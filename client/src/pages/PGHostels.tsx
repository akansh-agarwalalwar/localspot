import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, MapPin, Star, Wifi, Car, Users, Utensils, Clock, IndianRupee, Eye, Heart, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { propertyAPI } from "@/services/api";
import { Property } from "@/types";
import PropertyImageFast from "@/components/common/PropertyImageFast";
import PropertyAmenities from "@/components/common/PropertyAmenities";
import { amenityConfig, getAvailableRoomTypes } from "@/utils/propertyUtils";
import { createBookingMessage, createWhatsAppURL } from "@/utils/whatsappConfig";
import { toast } from "sonner";

const PGHostels = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 25000]); // Changed from [5000, 20000] to include all properties
  const [distanceRange, setDistanceRange] = useState([0, 5000]); // Distance in meters (0 to 5km)
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedACTypes, setSelectedACTypes] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    mobile: '',
    email: '',
    roomType: '',
    moveInDate: '',
    message: ''
  });
  const itemsPerPage = 4; // Show 4 properties per page

  // Fetch properties from backend
  useEffect(() => {
    // Ensure page starts from top when component mounts
    window.scrollTo(0, 0);
    
    // Check for search parameter from URL
    const urlSearchTerm = searchParams.get('search');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const response = await propertyAPI.getAllProperties({ 
          page: 1, 
          limit: itemsPerPage 
        });
        const data = response.data;
        const properties = data.properties || [];
        setProperties(properties);
        setTotalProperties(data.pagination?.total || 0);
        setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
        
        // Preload first few images for faster display
        properties.slice(0, 2).forEach((property) => {
          // Prioritize cover photo, fallback to first pic
          const imageUrl = property.coverPhoto || (property.pics && property.pics.length > 0 ? property.pics[0] : null);
          if (imageUrl) {
            const img = new Image();
            img.src = imageUrl.includes('drive.google.com') 
              ? `https://drive.google.com/uc?export=view&id=${imageUrl.match(/\/d\/(.+?)\//)?.[1] || ''}`
              : imageUrl;
          }
        });
      } catch (error: any) {
        toast.error('Failed to fetch properties');
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Reset and refetch when search term changes
  useEffect(() => {
    const resetAndFetch = async () => {
      if (searchTerm !== "") {
        // If there's a search term, fetch all properties and filter client-side
        try {
          setLoading(true);
          const response = await propertyAPI.getAllProperties({ 
            page: 1, 
            limit: 100 // Get more properties for better search results
          });
          const data = response.data;
          setProperties(data.properties || []);
          setTotalProperties(data.pagination?.total || 0);
          setCurrentPage(1);
          setHasMore(false); // Disable pagination during search
        } catch (error: any) {
          toast.error('Failed to fetch properties');
          console.error('Error fetching properties:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset to initial state when search is cleared
        try {
          setLoading(true);
          setCurrentPage(1);
          const response = await propertyAPI.getAllProperties({ 
            page: 1, 
            limit: itemsPerPage 
          });
          const data = response.data;
          setProperties(data.properties || []);
          setTotalProperties(data.pagination?.total || 0);
          setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
        } catch (error: any) {
          toast.error('Failed to fetch properties');
          console.error('Error fetching properties:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(resetAndFetch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Load more properties
  const loadMoreProperties = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await propertyAPI.getAllProperties({ 
        page: nextPage, 
        limit: itemsPerPage 
      });
      const data = response.data;
      
      // Append new properties to existing ones
      setProperties(prev => [...prev, ...(data.properties || [])]);
      setCurrentPage(nextPage);
      setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
    } catch (error: any) {
      toast.error('Failed to load more properties');
      console.error('Error loading more properties:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle booking button click
  const handleBookNow = (property: Property) => {
    setSelectedProperty(property);
    setIsBookingOpen(true);
    // Reset form when opening
    setBookingForm({
      name: '',
      mobile: '',
      email: '',
      roomType: '',
      moveInDate: '',
      message: ''
    });
  };

  // Handle form input changes
  const handleFormChange = (field: string, value: string) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle WhatsApp submission
  const handleSubmitBooking = () => {
    // Validate required fields
    if (!bookingForm.name || !bookingForm.mobile || !bookingForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedProperty) {
      toast.error('No property selected');
      return;
    }

    // Create message using utility function
    const message = createBookingMessage(selectedProperty, bookingForm);
    
    // Create WhatsApp URL
    const whatsappURL = createWhatsAppURL(message);
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Close dialog and show success message
    setIsBookingOpen(false);
    toast.success('Redirecting to WhatsApp...');
  };

  // Handle room type filter change
  const handleRoomTypeChange = (roomType: string) => {
    setSelectedRoomTypes(prev => {
      const newSelection = prev.includes(roomType)
        ? prev.filter(type => type !== roomType)
        : [...prev, roomType];
      return newSelection;
    });
  };

  // Handle AC type filter change
  const handleACTypeChange = (acType: string) => {
    setSelectedACTypes(prev => {
      const newSelection = prev.includes(acType)
        ? prev.filter(type => type !== acType)
        : [...prev, acType];
      return newSelection;
    });
  };

  // Filter and sort properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    // Distance filtering - simple keyword matching for now
    const matchesDistance = (() => {
      const location = property.location.toLowerCase();
      const maxDistance = distanceRange[1];
      
      // If max distance is 5000m (5km), include all properties
      if (maxDistance >= 5000) return true;
      
      // Simple distance matching based on location keywords
      if (maxDistance >= 0 && maxDistance < 500) {
        // Very close (0-500m): look for "near", "opposite", "next to" DTU/college
        return location.includes('near') || location.includes('opposite') || location.includes('next');
      } else if (maxDistance >= 500 && maxDistance < 1000) {
        // Close (500m-1km): include areas known to be close to DTU
        return location.includes('dtu') || location.includes('rohini') || location.includes('sector');
      } else if (maxDistance >= 1000 && maxDistance < 2000) {
        // Medium (1-2km): broader DTU area
        return location.includes('dtu') || location.includes('delhi') || location.includes('north');
      } else {
        // Far (2-5km): include all areas
        return true;
      }
    })();

    // Room type filtering
    const matchesRoomType = selectedRoomTypes.length === 0 || 
      selectedRoomTypes.some(selectedType => {
        // Map UI room types to backend field names
        const roomTypeMap: { [key: string]: string } = {
          'Single Seater': 'single',
          'Double Seater': 'double', 
          'Triple Seater': 'triple'
        };
        const backendType = roomTypeMap[selectedType];
        return property.roomTypes && property.roomTypes[backendType];
      });

    // AC type filtering
    const matchesACType = selectedACTypes.length === 0 || 
      selectedACTypes.some(selectedAC => {
        if (selectedAC === 'AC') {
          // Check if property has AC amenity
          return property.amenities && property.amenities.ac === true;
        }
        if (selectedAC === 'Non-AC') {
          // Check if property does NOT have AC amenity
          return !property.amenities || property.amenities.ac === false;
        }
        return false;
      });
    
    return matchesSearch && matchesPrice && matchesDistance && matchesRoomType && matchesACType && property.isActive;
  });

  // Sort properties based on selected criteria
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

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
              PGs & Hostels in Delhi
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Find comfortable and affordable accommodations with all modern amenities
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Search location..." 
                  className="bg-white text-black placeholder:text-gray-500" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                    min={0}
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
                      <Checkbox 
                        id={type}
                        checked={selectedRoomTypes.includes(type)}
                        onCheckedChange={() => handleRoomTypeChange(type)}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>

                {/* AC Type */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">AC Type</h4>
                  {["AC", "Non-AC"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={type}
                        checked={selectedACTypes.includes(type)}
                        onCheckedChange={() => handleACTypeChange(type)}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>

                {/* Distance Filter */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Distance from DTU
                  </h4>
                  <Slider
                    value={distanceRange}
                    onValueChange={setDistanceRange}
                    max={5000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{distanceRange[0]}m</span>
                    <span>
                      {distanceRange[1] >= 5000 
                        ? "5km+" 
                        : distanceRange[1] >= 1000 
                          ? `${(distanceRange[1] / 1000).toFixed(1)}km`
                          : `${distanceRange[1]}m`
                      }
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>0-500m:</span>
                        <span className="text-green-600">Walking distance</span>
                      </div>
                      <div className="flex justify-between">
                        <span>500m-1km:</span>
                        <span className="text-blue-600">Very close</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1-2km:</span>
                        <span className="text-orange-600">Close</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2-5km:</span>
                        <span className="text-gray-600">Nearby</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {loading ? "Loading..." : `Showing ${sortedProperties.length} of ${totalProperties} PGs & Hostels`}
                </h2>
                <p className="text-muted-foreground">Best accommodations in Delhi</p>
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
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 text-black">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="price-low" className="text-black hover:bg-gray-100">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="text-black hover:bg-gray-100">Price: High to Low</SelectItem>
                    <SelectItem value="newest" className="text-black hover:bg-gray-100">Newest First</SelectItem>
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
              {loading ? (
                // Loading skeleton
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-card rounded-2xl p-6 animate-pulse">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
                        <div className="md:col-span-2 space-y-4">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedProperties.length === 0 ? (
                // No properties found
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || priceRange[0] !== 0 || priceRange[1] !== 25000
                        ? 'Try adjusting your search criteria or filters.'
                        : 'No properties are currently available.'}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange([0, 25000]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              ) : (
                // Properties list
                sortedProperties.map((property, index) => (
                  <motion.div
                    key={property._id}
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
                          {/* Prioritize cover photo, fallback to first pic */}
                          {(property.coverPhoto || (property.pics && property.pics.length > 0)) ? (
                            <PropertyImageFast 
                              src={property.coverPhoto || property.pics[0]} 
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-center">
                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">No Image</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Badge */}
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold">
                          Featured
                        </Badge>
                        
                        {/* Image Count - Count total photos */}
                        {(() => {
                          const totalPhotos = (property.coverPhoto ? 1 : 0) + 
                                            (property.facilityPhotos?.length || 0) + 
                                            (property.pics?.length || 0);
                          return totalPhotos > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                              {totalPhotos} photos
                            </div>
                          );
                        })()}
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                {property.title}
                              </h3>
                              <Badge variant="outline" className="text-xs text-success border-success">
                                Verified
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span>{property.location}</span>
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

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {property.description}
                        </p>

                        {/* Amenities - Fetch from backend property data */}
                        <div className="space-y-2">
                          <PropertyAmenities 
                            property={property} 
                            compact={true} 
                            showRoomTypes={true}
                            className="text-sm"
                          />
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">
                                ₹{property.price.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">per month</span>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/pg-details/${property._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button 
                              className="hover-glow"
                              onClick={() => handleBookNow(property)}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Load More */}
            {!loading && sortedProperties.length > 0 && hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="hover:bg-gradient-primary hover:text-white"
                  onClick={loadMoreProperties}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    `Load More Listings (${totalProperties - sortedProperties.length} remaining)`
                  )}
                </Button>
              </motion.div>
            )}

            {/* Show message when all properties are loaded */}
            {!loading && sortedProperties.length > 0 && !hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                  <Button 
                    variant="link" 
                    className="ml-2 p-0 h-auto"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Back to top
                  </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Your Stay</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pb-4">
            {selectedProperty && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-sm">{selectedProperty.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
                <p className="text-sm font-medium text-primary">₹{selectedProperty.price.toLocaleString()}/month</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                placeholder="Enter your full name" 
                value={bookingForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="text-black placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input 
                id="mobile" 
                placeholder="Enter your mobile number" 
                value={bookingForm.mobile}
                onChange={(e) => handleFormChange('mobile', e.target.value)}
                className="text-black placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Enter your email address" 
                value={bookingForm.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                className="text-black placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-type">Room Type</Label>
              <Select value={bookingForm.roomType} onValueChange={(value) => handleFormChange('roomType', value)}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {(() => {
                    if (selectedProperty) {
                      const availableRoomTypes = getAvailableRoomTypes(selectedProperty);
                      if (availableRoomTypes.length > 0) {
                        return availableRoomTypes.map((roomType) => (
                          <SelectItem key={roomType.key} value={roomType.key} className="text-black hover:bg-gray-100">
                            {roomType.label} Room - ₹{selectedProperty.price.toLocaleString()}
                            {roomType.key === 'dormitory' && selectedProperty.dormitoryMembers && selectedProperty.dormitoryMembers.length > 0 && (
                              <span className="text-xs text-purple-600 ml-2">
                                ({selectedProperty.dormitoryMembers.length} current residents)
                              </span>
                            )}
                          </SelectItem>
                        ));
                      }
                    }
                    return (
                      <SelectItem value="standard" className="text-black hover:bg-gray-100">
                        Standard Room - ₹{selectedProperty?.price?.toLocaleString() || 'N/A'}
                      </SelectItem>
                    );
                  })()}
                </SelectContent>
              </Select>
            </div>
            
            {/* Show dormitory member information if dormitory is selected */}
            {bookingForm.roomType === 'dormitory' && selectedProperty && selectedProperty.dormitoryMembers && selectedProperty.dormitoryMembers.length > 0 && (
              <div className="space-y-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Label className="text-purple-800 font-medium">Current Dormitory Residents</Label>
                <div className="space-y-2">
                  {selectedProperty.dormitoryMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.fullName}</p>
                          <p className="text-xs text-gray-600">{member.year} • {member.branch}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{member.state}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-purple-700">
                  💡 You'll be sharing this accommodation with the residents listed above.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Move-in Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={bookingForm.moveInDate}
                onChange={(e) => handleFormChange('moveInDate', e.target.value)}
                className="text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Message</Label>
              <Textarea 
                id="message" 
                placeholder="Any special requirements..." 
                value={bookingForm.message}
                onChange={(e) => handleFormChange('message', e.target.value)}
                className="text-black placeholder:text-gray-500"
              />
            </div>
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90"
              onClick={handleSubmitBooking}
            >
              Submit Booking Request via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PGHostels;