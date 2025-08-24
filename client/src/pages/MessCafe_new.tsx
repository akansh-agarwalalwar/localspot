import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, IndianRupee, Utensils, Filter, Eye, Heart, Share2, Calendar, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { messAPI } from "@/services/api";
import { Mess } from "@/types";
import PropertyImageFast from "@/components/common/PropertyImageFast";
import { createBookingMessage, createWhatsAppURL } from "@/utils/whatsappConfig";
import { toast } from "sonner";

const MessCafe = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]); // Daily pricing range
  const [messes, setMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMesses, setTotalMesses] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null);
  const [mealFilter, setMealFilter] = useState<string[]>([]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    mobile: '',
    email: '',
    mealType: '',
    startDate: '',
    message: ''
  });
  const itemsPerPage = 4;

  // Fetch messes from backend
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchMesses = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const response = await messAPI.getAllMesses({ 
          page: 1, 
          limit: itemsPerPage 
        });
        const data = response.data;
        const messes = data.messes || [];
        setMesses(messes);
        setTotalMesses(data.pagination?.total || 0);
        setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
        
        // Preload first few images for faster display
        messes.slice(0, 2).forEach((mess) => {
          if (mess.coverPhoto) {
            const img = new Image();
            img.src = mess.coverPhoto.includes('drive.google.com') 
              ? `https://drive.google.com/uc?export=view&id=${mess.coverPhoto.match(/\/d\/(.+?)\//)?.[1] || ''}`
              : mess.coverPhoto;
          }
        });
      } catch (error: any) {
        toast.error('Failed to fetch messes');
        console.error('Error fetching messes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMesses();
  }, []);

  // Reset and refetch when search term changes
  useEffect(() => {
    const resetAndFetch = async () => {
      if (searchTerm !== "") {
        try {
          setLoading(true);
          const response = await messAPI.getAllMesses({ 
            page: 1, 
            limit: 100 
          });
          const data = response.data;
          setMesses(data.messes || []);
          setTotalMesses(data.pagination?.total || 0);
          setCurrentPage(1);
          setHasMore(false);
        } catch (error: any) {
          toast.error('Failed to fetch messes');
          console.error('Error fetching messes:', error);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          setLoading(true);
          setCurrentPage(1);
          const response = await messAPI.getAllMesses({ 
            page: 1, 
            limit: itemsPerPage 
          });
          const data = response.data;
          setMesses(data.messes || []);
          setTotalMesses(data.pagination?.total || 0);
          setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
        } catch (error: any) {
          toast.error('Failed to fetch messes');
          console.error('Error fetching messes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(resetAndFetch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Load more messes
  const loadMoreMesses = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await messAPI.getAllMesses({ 
        page: nextPage, 
        limit: itemsPerPage 
      });
      const data = response.data;
      
      setMesses(prev => [...prev, ...(data.messes || [])]);
      setCurrentPage(nextPage);
      setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
    } catch (error: any) {
      toast.error('Failed to load more messes');
      console.error('Error loading more messes:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle booking button click
  const handleBookNow = (mess: Mess) => {
    setSelectedMess(mess);
    setIsBookingOpen(true);
    setBookingForm({
      name: '',
      mobile: '',
      email: '',
      mealType: '',
      startDate: '',
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
    if (!bookingForm.name || !bookingForm.mobile || !bookingForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedMess) {
      toast.error('No mess selected');
      return;
    }

    // Create custom message for mess booking
    const message = `Hello! I'd like to book meals at ${selectedMess.title}.

*Customer Details:*
Name: ${bookingForm.name}
Mobile: ${bookingForm.mobile}
Email: ${bookingForm.email}

*Booking Details:*
Mess: ${selectedMess.title}
Location: ${selectedMess.location}
${bookingForm.mealType ? `Meal Type: ${bookingForm.mealType}` : ''}
${bookingForm.startDate ? `Start Date: ${bookingForm.startDate}` : ''}

${bookingForm.message ? `Additional Message: ${bookingForm.message}` : ''}

Please provide more details about pricing and availability.`;
    
    const whatsappURL = createWhatsAppURL(message);
    window.open(whatsappURL, '_blank');
    
    setIsBookingOpen(false);
    toast.success('Redirecting to WhatsApp...');
  };

  // Calculate average meal price for sorting
  const getAverageMealPrice = (mess: Mess) => {
    const prices = [];
    if (mess.timings.breakfast.available) prices.push(mess.pricing.breakfast);
    if (mess.timings.lunch.available) prices.push(mess.pricing.lunch);
    if (mess.timings.dinner.available) prices.push(mess.pricing.dinner);
    if (mess.timings.snacks.available) prices.push(mess.pricing.snacks);
    
    return prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
  };

  // Filter and sort messes
  const filteredMesses = messes.filter(mess => {
    const matchesSearch = mess.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mess.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const avgPrice = getAverageMealPrice(mess);
    const matchesPrice = avgPrice >= priceRange[0] && avgPrice <= priceRange[1];
    
    const matchesMeals = mealFilter.length === 0 || mealFilter.some(meal => {
      switch(meal) {
        case 'breakfast': return mess.timings.breakfast.available;
        case 'lunch': return mess.timings.lunch.available;
        case 'dinner': return mess.timings.dinner.available;
        case 'snacks': return mess.timings.snacks.available;
        default: return false;
      }
    });
    
    return matchesSearch && matchesPrice && matchesMeals && mess.isActive;
  });

  // Sort messes
  const sortedMesses = [...filteredMesses].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return getAverageMealPrice(a) - getAverageMealPrice(b);
      case 'price-high':
        return getAverageMealPrice(b) - getAverageMealPrice(a);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

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
              Messes & Cafes in Delhi
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Delicious homemade meals and fresh food options near your location
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Input 
                  placeholder="Search location..." 
                  className="bg-white" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Meal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
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
                  <h4 className="font-medium">Average Meal Price</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Meal Type */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Available Meals</h4>
                  {["breakfast", "lunch", "dinner", "snacks"].map((meal) => (
                    <div key={meal} className="flex items-center space-x-2">
                      <Checkbox 
                        id={meal}
                        checked={mealFilter.includes(meal)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setMealFilter(prev => [...prev, meal]);
                          } else {
                            setMealFilter(prev => prev.filter(m => m !== meal));
                          }
                        }}
                      />
                      <label htmlFor={meal} className="text-sm capitalize">{meal}</label>
                    </div>
                  ))}
                </div>

                {/* AC Type */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Air Conditioning</h4>
                  {["AC", "Non-AC"].map((type) => (
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
                <h2 className="text-2xl font-bold">
                  {loading ? "Loading..." : `Showing ${sortedMesses.length} of ${totalMesses} Messes & Cafes`}
                </h2>
                <p className="text-muted-foreground">Best food options in Delhi</p>
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
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
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
              ) : sortedMesses.length === 0 ? (
                // No messes found
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Utensils className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No messes found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || priceRange[0] !== 0 || priceRange[1] !== 200
                        ? 'Try adjusting your search criteria or filters.'
                        : 'No messes are currently available.'}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange([0, 200]);
                        setMealFilter([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              ) : (
                // Messes list
                sortedMesses.map((mess, index) => (
                  <motion.div
                    key={mess._id}
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
                          {mess.coverPhoto || (mess.images && mess.images.length > 0) ? (
                            <PropertyImageFast 
                              src={mess.coverPhoto || mess.images[0]} 
                              alt={mess.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-center">
                                <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">No Image</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Badge */}
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold">
                          {mess.hasAC ? 'AC Available' : 'Pure Veg'}
                        </Badge>
                        
                        {/* Image Count */}
                        {mess.images && mess.images.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            {mess.images.length} photos
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
                                {mess.title}
                              </h3>
                              <Badge variant="outline" className="text-xs text-success border-success">
                                Verified
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span>{mess.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{mess.distanceFromDTU} from DTU</span>
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
                          {mess.description}
                        </p>

                        {/* Meal Timings & Pricing */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            {mess.timings.breakfast.available && (
                              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                                <Clock className="h-3 w-3 text-primary" />
                                <span>Breakfast: {mess.timings.breakfast.time}</span>
                                <span className="ml-auto font-semibold">₹{mess.pricing.breakfast}</span>
                              </div>
                            )}
                            {mess.timings.lunch.available && (
                              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                                <Clock className="h-3 w-3 text-primary" />
                                <span>Lunch: {mess.timings.lunch.time}</span>
                                <span className="ml-auto font-semibold">₹{mess.pricing.lunch}</span>
                              </div>
                            )}
                            {mess.timings.dinner.available && (
                              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                                <Clock className="h-3 w-3 text-primary" />
                                <span>Dinner: {mess.timings.dinner.time}</span>
                                <span className="ml-auto font-semibold">₹{mess.pricing.dinner}</span>
                              </div>
                            )}
                            {mess.timings.snacks.available && (
                              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                                <Clock className="h-3 w-3 text-primary" />
                                <span>Snacks: {mess.timings.snacks.time}</span>
                                <span className="ml-auto font-semibold">₹{mess.pricing.snacks}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Average Price & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">
                                ₹{Math.round(getAverageMealPrice(mess))}
                              </span>
                              <span className="text-sm text-muted-foreground">avg per meal</span>
                            </div>
                            {mess.hasAC && (
                              <Badge variant="secondary" className="text-xs mt-1">AC Available</Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-3">
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/mess-details/${mess._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button 
                              className="hover-glow"
                              onClick={() => handleBookNow(mess)}
                            >
                              Book Meals
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
            {!loading && sortedMesses.length > 0 && hasMore && (
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
                  onClick={loadMoreMesses}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Loading...
                    </>
                  ) : (
                    `Load More Messes (${totalMesses - sortedMesses.length} remaining)`
                  )}
                </Button>
              </motion.div>
            )}

            {/* Show message when all messes are loaded */}
            {!loading && sortedMesses.length > 0 && !hasMore && (
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
            <DialogTitle>Book Your Meals</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pb-4">
            {selectedMess && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-sm">{selectedMess.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedMess.location}</p>
                <p className="text-sm font-medium text-primary">
                  Avg ₹{Math.round(getAverageMealPrice(selectedMess))}/meal
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                placeholder="Enter your full name" 
                value={bookingForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input 
                id="mobile" 
                placeholder="Enter your mobile number" 
                value={bookingForm.mobile}
                onChange={(e) => handleFormChange('mobile', e.target.value)}
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Preference</Label>
              <Select value={bookingForm.mealType} onValueChange={(value) => handleFormChange('mealType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedMess && (
                    <>
                      {selectedMess.timings.breakfast.available && (
                        <SelectItem value="breakfast">
                          Breakfast ({selectedMess.timings.breakfast.time}) - ₹{selectedMess.pricing.breakfast}
                        </SelectItem>
                      )}
                      {selectedMess.timings.lunch.available && (
                        <SelectItem value="lunch">
                          Lunch ({selectedMess.timings.lunch.time}) - ₹{selectedMess.pricing.lunch}
                        </SelectItem>
                      )}
                      {selectedMess.timings.dinner.available && (
                        <SelectItem value="dinner">
                          Dinner ({selectedMess.timings.dinner.time}) - ₹{selectedMess.pricing.dinner}
                        </SelectItem>
                      )}
                      {selectedMess.timings.snacks.available && (
                        <SelectItem value="snacks">
                          Snacks ({selectedMess.timings.snacks.time}) - ₹{selectedMess.pricing.snacks}
                        </SelectItem>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Start Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={bookingForm.startDate}
                onChange={(e) => handleFormChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Message</Label>
              <Textarea 
                id="message" 
                placeholder="Any dietary requirements or special requests..." 
                value={bookingForm.message}
                onChange={(e) => handleFormChange('message', e.target.value)}
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

export default MessCafe;
