import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, IndianRupee, Gamepad2, Users, Trophy, Wifi, Calendar, Eye, Heart, Share2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { gamingZoneAPI } from "@/services/api";
import { GamingZone } from "@/types";
import { toast } from "sonner";

const GamingZonePage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]); // Hourly price range
  const [selectedACTypes, setSelectedACTypes] = useState<string[]>([]);
  const [gamingZones, setGamingZones] = useState<GamingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalGamingZones, setTotalGamingZones] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedGamingZone, setSelectedGamingZone] = useState<GamingZone | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    mobile: '',
    email: '',
    gameType: '',
    preferredTime: '',
    message: ''
  });
  const itemsPerPage = 4; // Show 4 gaming zones per page

  // Fetch gaming zones from backend
  useEffect(() => {
    // Ensure page starts from top when component mounts
    window.scrollTo(0, 0);
    
    const fetchGamingZones = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const response = await gamingZoneAPI.getAllGamingZones({ 
          page: 1, 
          limit: itemsPerPage 
        });
        const data = response.data;
        const zones = data.gamingZones || [];
        setGamingZones(zones);
        setTotalGamingZones(data.pagination?.total || 0);
        setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
      } catch (error: any) {
        toast.error('Failed to fetch gaming zones');
        console.error('Error fetching gaming zones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamingZones();
  }, []);

  // Reset and refetch when search term changes
  useEffect(() => {
    const resetAndFetch = async () => {
      if (searchTerm !== "") {
        // If there's a search term, fetch all gaming zones and filter client-side
        try {
          setLoading(true);
          const response = await gamingZoneAPI.getAllGamingZones({ 
            page: 1, 
            limit: 100 // Get more gaming zones for better search results
          });
          const data = response.data;
          setGamingZones(data.gamingZones || []);
          setTotalGamingZones(data.pagination?.total || 0);
          setCurrentPage(1);
          setHasMore(false); // Disable pagination during search
        } catch (error: any) {
          toast.error('Failed to fetch gaming zones');
          console.error('Error fetching gaming zones:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset to initial state when search is cleared
        try {
          setLoading(true);
          setCurrentPage(1);
          const response = await gamingZoneAPI.getAllGamingZones({ 
            page: 1, 
            limit: itemsPerPage 
          });
          const data = response.data;
          setGamingZones(data.gamingZones || []);
          setTotalGamingZones(data.pagination?.total || 0);
          setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
        } catch (error: any) {
          toast.error('Failed to fetch gaming zones');
          console.error('Error fetching gaming zones:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(resetAndFetch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Load more gaming zones
  const loadMoreGamingZones = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await gamingZoneAPI.getAllGamingZones({ 
        page: nextPage, 
        limit: itemsPerPage 
      });
      const data = response.data;
      
      // Append new gaming zones to existing ones
      setGamingZones(prev => [...prev, ...(data.gamingZones || [])]);
      setCurrentPage(nextPage);
      setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
    } catch (error: any) {
      toast.error('Failed to load more gaming zones');
      console.error('Error loading more gaming zones:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle booking button click
  const handleBookNow = (gamingZone: GamingZone) => {
    setSelectedGamingZone(gamingZone);
    setIsBookingOpen(true);
    // Reset form when opening
    setBookingForm({
      name: '',
      mobile: '',
      email: '',
      gameType: '',
      preferredTime: '',
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

    if (!selectedGamingZone) {
      toast.error('No gaming zone selected');
      return;
    }

    // Create booking message
    const message = `🎮 *Gaming Zone Booking Request*

*Gaming Zone:* ${selectedGamingZone.title}
*Location:* ${selectedGamingZone.location}
*Hourly Rate:* ₹${selectedGamingZone.hourlyPrice}
*Monthly Rate:* ₹${selectedGamingZone.monthlyPrice}

*Customer Details:*
*Name:* ${bookingForm.name}
*Mobile:* ${bookingForm.mobile}
*Email:* ${bookingForm.email}
${bookingForm.gameType ? `*Preferred Game:* ${bookingForm.gameType}` : ''}
${bookingForm.preferredTime ? `*Preferred Time:* ${bookingForm.preferredTime}` : ''}

${bookingForm.message ? `*Message:* ${bookingForm.message}` : ''}

Please confirm availability and booking details.`;
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/918852019731?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Close dialog and show success message
    setIsBookingOpen(false);
    toast.success('Redirecting to WhatsApp...');
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

  // Filter and sort gaming zones
  const filteredGamingZones = gamingZones.filter(zone => {
    const matchesSearch = zone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = zone.hourlyPrice >= priceRange[0] && zone.hourlyPrice <= priceRange[1];
    
    // AC type filtering
    const matchesACType = selectedACTypes.length === 0 || 
      selectedACTypes.some(selectedAC => {
        if (selectedAC === 'AC') {
          // Check if gaming zone has AC amenity
          return zone.amenities && zone.amenities.ac === true;
        }
        if (selectedAC === 'Non-AC') {
          // Check if gaming zone does NOT have AC amenity
          return !zone.amenities || zone.amenities.ac === false;
        }
        return false;
      });
    
    return matchesSearch && matchesPrice && matchesACType && zone.isActive;
  });

  // Sort gaming zones based on selected criteria
  const sortedGamingZones = [...filteredGamingZones].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.hourlyPrice - b.hourlyPrice;
      case 'price-high':
        return b.hourlyPrice - a.hourlyPrice;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const popularGames = [
    { name: "FIFA 24", category: "Sports", platforms: ["PS5", "PC"] },
    { name: "Call of Duty", category: "Shooter", platforms: ["PS5", "PC", "Xbox"] },
    { name: "Valorant", category: "Tactical Shooter", platforms: ["PC"] },
    { name: "PUBG", category: "Battle Royale", platforms: ["PC", "Mobile"] },
    { name: "Fortnite", category: "Battle Royale", platforms: ["PC", "PS5"] },
    { name: "GTA V", category: "Action", platforms: ["PC", "PS5"] }
  ];

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
              Gaming Zones & Entertainment
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Play the latest games, join tournaments, and enjoy premium gaming experiences
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Search location..." className="bg-white text-black placeholder:text-gray-500" />
                <Select>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="Game Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="pc" className="text-black hover:bg-gray-100">PC Gaming</SelectItem>
                    <SelectItem value="console" className="text-black hover:bg-gray-100">Console Gaming</SelectItem>
                    <SelectItem value="vr" className="text-black hover:bg-gray-100">VR Gaming</SelectItem>
                    <SelectItem value="mobile" className="text-black hover:bg-gray-100">Mobile Gaming</SelectItem>
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
                  <h4 className="font-medium">Hourly Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Gaming Platform */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Gaming Platform</h4>
                  {["PS5", "Xbox", "PC Gaming", "VR Games"].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox id={platform} />
                      <label htmlFor={platform} className="text-sm">{platform}</label>
                    </div>
                  ))}
                </div>

                {/* Amenities */}
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Listings */}
          <div className="flex-1">
            {/* Popular Games Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    Popular Games Available
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {popularGames.map((game, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="text-center p-4 bg-muted/50 rounded-lg hover:bg-primary-light transition-colors duration-300"
                      >
                        <Gamepad2 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold text-sm mb-1">{game.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{game.category}</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {game.platforms.map((platform, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {loading ? "Loading..." : `Showing ${sortedGamingZones.length} of ${totalGamingZones} Gaming Zones`}
                </h2>
                <p className="text-muted-foreground">Premium gaming experiences in Delhi</p>
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

            {/* Gaming Zones Grid */}
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
              ) : sortedGamingZones.length === 0 ? (
                // No gaming zones found
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Gamepad2 className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No gaming zones found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || priceRange[0] !== 0 || priceRange[1] !== 5000
                        ? 'Try adjusting your search criteria or filters.'
                        : 'No gaming zones are currently available.'}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange([0, 5000]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              ) : (
                // Gaming zones list
                sortedGamingZones.map((zone, index) => (
                  <motion.div
                    key={zone._id}
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
                          {zone.coverPhoto ? (
                            <img 
                              src={zone.coverPhoto} 
                              alt={zone.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
                              <div className="text-center">
                                <Gamepad2 className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                                <span className="text-sm text-purple-500 font-medium">Gaming Zone</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Badge */}
                        <Badge className="absolute top-3 left-3 bg-purple-600 text-white font-semibold">
                          Gaming Zone
                        </Badge>
                        
                        {/* Image Count */}
                        {zone.images && zone.images.length > 0 && (
                          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            {zone.images.length + 1} photos
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                {zone.title}
                              </h3>
                              <Badge variant="outline" className="text-xs text-success border-success">
                                {zone.isActive ? 'Available' : 'Closed'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{zone.location}</span>
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
                          {zone.description}
                        </p>

                        {/* Amenities */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {zone.amenities?.ac && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                ❄️ AC
                              </Badge>
                            )}
                            {zone.amenities?.ps5 && (
                              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                                🎮 PS5
                              </Badge>
                            )}
                            {zone.amenities?.xbox && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                🎯 Xbox
                              </Badge>
                            )}
                            {zone.amenities?.wifi && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                📶 WiFi
                              </Badge>
                            )}
                            {zone.amenities?.parking && (
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                🅿️ Parking
                              </Badge>
                            )}
                            {zone.amenities?.cctv && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                📹 CCTV
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-2xl font-bold text-purple-600">
                                  ₹{zone.hourlyPrice}
                                </span>
                                <span className="text-sm text-muted-foreground ml-1">per hour</span>
                              </div>
                              <div>
                                <span className="text-lg font-semibold text-green-600">
                                  ₹{zone.monthlyPrice}
                                </span>
                                <span className="text-sm text-muted-foreground ml-1">per month</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/gaming-zone-details/${zone._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button 
                              className="hover-glow bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleBookNow(zone)}
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
            {!loading && sortedGamingZones.length > 0 && hasMore && (
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
                  onClick={loadMoreGamingZones}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    `Load More Gaming Zones (${totalGamingZones - sortedGamingZones.length} remaining)`
                  )}
                </Button>
              </motion.div>
            )}

            {/* Show message when all gaming zones are loaded */}
            {!loading && sortedGamingZones.length > 0 && !hasMore && (
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
            <DialogTitle>Book Gaming Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pb-4">
            {selectedGamingZone && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-sm">{selectedGamingZone.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedGamingZone.location}</p>
                <div className="flex gap-4 mt-1">
                  <p className="text-sm font-medium text-purple-600">₹{selectedGamingZone.hourlyPrice}/hr</p>
                  <p className="text-sm font-medium text-green-600">₹{selectedGamingZone.monthlyPrice}/month</p>
                </div>
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
              <Label htmlFor="game-type">Preferred Game</Label>
              <Select value={bookingForm.gameType} onValueChange={(value) => handleFormChange('gameType', value)}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select game type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="fifa" className="text-black hover:bg-gray-100">FIFA 24</SelectItem>
                  <SelectItem value="cod" className="text-black hover:bg-gray-100">Call of Duty</SelectItem>
                  <SelectItem value="valorant" className="text-black hover:bg-gray-100">Valorant</SelectItem>
                  <SelectItem value="pubg" className="text-black hover:bg-gray-100">PUBG</SelectItem>
                  <SelectItem value="fortnite" className="text-black hover:bg-gray-100">Fortnite</SelectItem>
                  <SelectItem value="gta" className="text-black hover:bg-gray-100">GTA V</SelectItem>
                  <SelectItem value="other" className="text-black hover:bg-gray-100">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input 
                id="time" 
                type="datetime-local" 
                value={bookingForm.preferredTime}
                onChange={(e) => handleFormChange('preferredTime', e.target.value)}
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
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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

export default GamingZonePage;