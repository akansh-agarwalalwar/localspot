import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, MapPin, Utensils, Clock, IndianRupee, 
  Phone, Share2, Heart, Calendar, User, Check, X,
  ChevronLeft, ChevronRight, Zap, Home, Coffee, Soup, UtensilsCrossed, Cookie
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { messAPI } from "@/services/api";
import { Mess } from "@/types";
import PropertyImage from "@/components/common/PropertyImage";
import { createWhatsAppURL } from "@/utils/whatsappConfig";
import { toast } from "sonner";

const MessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [mess, setMess] = useState<Mess | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    mobile: '',
    email: '',
    mealType: '',
    startDate: '',
    message: ''
  });

  // Get all photos from mess
  const getAllPhotos = (mess: Mess | null): string[] => {
    if (!mess) return [];
    
    const allPhotos: string[] = [];
    
    // Add cover photo first (if exists)
    if (mess.coverPhoto) {
      allPhotos.push(mess.coverPhoto);
    }
    
    // Add additional images
    if (mess.images && mess.images.length > 0) {
      // If we already have a cover photo, don't duplicate it
      const imagesToAdd = mess.coverPhoto 
        ? mess.images.filter(img => img !== mess.coverPhoto)
        : mess.images;
      allPhotos.push(...imagesToAdd.filter(img => img && img.trim() !== ''));
    }
    
    // Remove duplicates
    return [...new Set(allPhotos)];
  };

  const allPhotos = getAllPhotos(mess);

  // Fetch mess data
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchMess = async () => {
      if (!id) {
        console.log('❌ No mess ID provided');
        navigate('/mess-cafe');
        return;
      }

      try {
        console.log('🔍 Fetching mess with ID:', id);
        setLoading(true);
        const response = await messAPI.getMessById(id);
        console.log('✅ Mess data received:', response.data);
        setMess(response.data.mess);
      } catch (error: any) {
        console.error('❌ Error fetching mess:', error);
        console.error('Error response:', error.response?.data);
        toast.error('Mess not found');
        navigate('/mess-cafe');
      } finally {
        setLoading(false);
      }
    };

    fetchMess();
  }, [id, navigate]);

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

    if (!mess) {
      toast.error('Mess information not available');
      return;
    }

    // Create custom message for mess booking
    const message = `Hello! I'd like to book meals at ${mess.title}.

*Customer Details:*
Name: ${bookingForm.name}
Mobile: ${bookingForm.mobile}
Email: ${bookingForm.email}

*Booking Details:*
Mess: ${mess.title}
Location: ${mess.location}
${bookingForm.mealType ? `Meal Type: ${bookingForm.mealType}` : ''}
${bookingForm.startDate ? `Start Date: ${bookingForm.startDate}` : ''}

${bookingForm.message ? `Additional Message: ${bookingForm.message}` : ''}

Please provide more details about pricing and availability.`;
    
    const whatsappURL = createWhatsAppURL(message);
    window.open(whatsappURL, '_blank');
    
    setIsBookingOpen(false);
    toast.success('Redirecting to WhatsApp...');
    
    // Reset form
    setBookingForm({
      name: '',
      mobile: '',
      email: '',
      mealType: '',
      startDate: '',
      message: ''
    });
  };

  // Calculate average meal price
  const getAverageMealPrice = (mess: Mess) => {
    const prices = [];
    if (mess.timings.breakfast.available) prices.push(mess.pricing.breakfast);
    if (mess.timings.lunch.available) prices.push(mess.pricing.lunch);
    if (mess.timings.dinner.available) prices.push(mess.pricing.dinner);
    if (mess.timings.snacks.available) prices.push(mess.pricing.snacks);
    
    return prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="text-center mt-8">
            <p className="text-muted-foreground">Loading mess details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!mess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Mess not found</h2>
            <p className="text-muted-foreground mb-4">
              Mess ID: {id || 'No ID provided'}
            </p>
            <Button 
              onClick={() => navigate('/mess-cafe')}
              className="hover:bg-primary/5"
            >
              Back to Mess Listings
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/mess-cafe')}
          className="mb-4 hover:bg-primary/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mess Listings
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-[16/10] bg-muted rounded-2xl overflow-hidden relative">
                {allPhotos.length > 0 ? (
                  <PropertyImage 
                    src={allPhotos[currentImageIndex]} 
                    alt={mess?.title || 'Mess Image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Utensils className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Navigation arrows - only show if multiple photos */}
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === 0 ? allPhotos.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === allPhotos.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Photo counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {allPhotos.length > 0 ? `${currentImageIndex + 1} / ${allPhotos.length}` : '0 / 0'}
                </div>
              </div>
              
              {/* Mess Description */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">About this Mess</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {mess?.description || "No description available for this mess."}
                </p>
              </div>
            </motion.div>

            {/* Mess Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{mess?.title}</h1>
                    <Badge className="bg-success text-success-foreground">
                      Verified
                    </Badge>
                    {mess?.hasAC && (
                      <Badge className="bg-blue-500 text-white">
                        AC Available
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{mess?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{mess?.distanceFromDTU} from DTU</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-success text-success-foreground">
                      {mess?.isActive ? 'Available' : 'Not Available'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Listed on {new Date(mess?.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="meals">Meals & Timing</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Mess</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {mess.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Key Highlights</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Average meal cost: ₹{Math.round(getAverageMealPrice(mess))}
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Available for immediate booking
                            </li>
                            {mess.hasAC && (
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-success" />
                                Air conditioned dining area
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Mess Details</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Distance: {mess.distanceFromDTU} from DTU</li>
                            <li>• Status: {mess.isActive ? 'Available' : 'Not Available'}</li>
                            <li>• AC: {mess.hasAC ? 'Available' : 'Not Available'}</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="meals" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Available Meals */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-700 flex items-center gap-2">
                          <Check className="h-5 w-5" />
                          Available Meals
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mess.timings.breakfast.available && (
                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                              <div className="flex items-center gap-3">
                                <Coffee className="h-6 w-6 text-orange-600" />
                                <div>
                                  <p className="font-medium text-orange-800">Breakfast</p>
                                  <p className="text-sm text-orange-600">{mess.timings.breakfast.time}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-orange-800">₹{mess.pricing.breakfast}</p>
                              </div>
                            </div>
                          )}
                          
                          {mess.timings.lunch.available && (
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                              <div className="flex items-center gap-3">
                                <Soup className="h-6 w-6 text-green-600" />
                                <div>
                                  <p className="font-medium text-green-800">Lunch</p>
                                  <p className="text-sm text-green-600">{mess.timings.lunch.time}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-800">₹{mess.pricing.lunch}</p>
                              </div>
                            </div>
                          )}
                          
                          {mess.timings.dinner.available && (
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-3">
                                <UtensilsCrossed className="h-6 w-6 text-blue-600" />
                                <div>
                                  <p className="font-medium text-blue-800">Dinner</p>
                                  <p className="text-sm text-blue-600">{mess.timings.dinner.time}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-blue-800">₹{mess.pricing.dinner}</p>
                              </div>
                            </div>
                          )}
                          
                          {mess.timings.snacks.available && (
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                              <div className="flex items-center gap-3">
                                <Cookie className="h-6 w-6 text-purple-600" />
                                <div>
                                  <p className="font-medium text-purple-800">Snacks</p>
                                  <p className="text-sm text-purple-600">{mess.timings.snacks.time}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-purple-800">₹{mess.pricing.snacks}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Unavailable Meals */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-700 flex items-center gap-2">
                          <X className="h-5 w-5" />
                          Not Available
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {!mess.timings.breakfast.available && (
                            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                              <Coffee className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">Breakfast</span>
                              <X className="h-4 w-4 text-red-600 ml-auto" />
                            </div>
                          )}
                          
                          {!mess.timings.lunch.available && (
                            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                              <Soup className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">Lunch</span>
                              <X className="h-4 w-4 text-red-600 ml-auto" />
                            </div>
                          )}
                          
                          {!mess.timings.dinner.available && (
                            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                              <UtensilsCrossed className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">Dinner</span>
                              <X className="h-4 w-4 text-red-600 ml-auto" />
                            </div>
                          )}
                          
                          {!mess.timings.snacks.available && (
                            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                              <Cookie className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">Snacks</span>
                              <X className="h-4 w-4 text-red-600 ml-auto" />
                            </div>
                          )}
                          
                          {/* Show message if all meals are available */}
                          {mess.timings.breakfast.available && 
                           mess.timings.lunch.available && 
                           mess.timings.dinner.available && 
                           mess.timings.snacks.available && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              All meals are available!
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Meal Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Individual Meal Prices</h4>
                          <div className="space-y-3">
                            {mess.timings.breakfast.available && (
                              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span>Breakfast ({mess.timings.breakfast.time})</span>
                                <span className="font-bold text-primary">₹{mess.pricing.breakfast}</span>
                              </div>
                            )}
                            {mess.timings.lunch.available && (
                              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span>Lunch ({mess.timings.lunch.time})</span>
                                <span className="font-bold text-primary">₹{mess.pricing.lunch}</span>
                              </div>
                            )}
                            {mess.timings.dinner.available && (
                              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span>Dinner ({mess.timings.dinner.time})</span>
                                <span className="font-bold text-primary">₹{mess.pricing.dinner}</span>
                              </div>
                            )}
                            {mess.timings.snacks.available && (
                              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span>Snacks ({mess.timings.snacks.time})</span>
                                <span className="font-bold text-primary">₹{mess.pricing.snacks}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Average Costs</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                              <span className="font-medium">Average per meal</span>
                              <span className="text-xl font-bold text-primary">₹{Math.round(getAverageMealPrice(mess))}</span>
                            </div>
                            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                              <p>• Prices may vary based on menu</p>
                              <p>• Monthly plans available with discounts</p>
                              {/* <p>• Contact for bulk booking rates</p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="policies" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Policies</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Advance Booking</span>
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Same Day Orders</span>
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Monthly Plans</span>
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Custom Meals</span>
                          <Check className="h-4 w-4 text-success" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Service Hours</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {mess.timings.breakfast.available && (
                          <div className="flex justify-between">
                            <span className="font-medium">Breakfast:</span>
                            <span className="text-muted-foreground">{mess.timings.breakfast.time}</span>
                          </div>
                        )}
                        {mess.timings.lunch.available && (
                          <div className="flex justify-between">
                            <span className="font-medium">Lunch:</span>
                            <span className="text-muted-foreground">{mess.timings.lunch.time}</span>
                          </div>
                        )}
                        {mess.timings.dinner.available && (
                          <div className="flex justify-between">
                            <span className="font-medium">Dinner:</span>
                            <span className="text-muted-foreground">{mess.timings.dinner.time}</span>
                          </div>
                        )}
                        {mess.timings.snacks.available && (
                          <div className="flex justify-between">
                            <span className="font-medium">Snacks:</span>
                            <span className="text-muted-foreground">{mess.timings.snacks.time}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Price Card */}
            <Card className="sticky top-24 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-0">
                {/* Mess Name Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-lg">
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">
                      {mess?.title}
                    </h2>
                  </div>
                </div>

                {/* Price Section */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b">
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{Math.round(getAverageMealPrice(mess))}
                        </span>
                      </div>
                      <p className="text-green-700 font-medium text-sm">average per meal</p>
                    </div>
                  </div>
                </div>

                {/* Booking Section */}
                <div className="p-6 space-y-4">
                  <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Meals
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Book Your Meals</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pb-4">
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
                              {mess.timings.breakfast.available && (
                                <SelectItem value="breakfast">
                                  Breakfast ({mess.timings.breakfast.time}) - ₹{mess.pricing.breakfast}
                                </SelectItem>
                              )}
                              {mess.timings.lunch.available && (
                                <SelectItem value="lunch">
                                  Lunch ({mess.timings.lunch.time}) - ₹{mess.pricing.lunch}
                                </SelectItem>
                              )}
                              {mess.timings.dinner.available && (
                                <SelectItem value="dinner">
                                  Dinner ({mess.timings.dinner.time}) - ₹{mess.pricing.dinner}
                                </SelectItem>
                              )}
                              {mess.timings.snacks.available && (
                                <SelectItem value="snacks">
                                  Snacks ({mess.timings.snacks.time}) - ₹{mess.pricing.snacks}
                                </SelectItem>
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

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-primary bg-primary/5 hover:bg-primary/5 hover:border-primary hover:text-current cursor-default">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    
                    <Button variant="outline" className="border-primary bg-primary/5 hover:bg-primary/5 hover:border-primary hover:text-current cursor-default">
                      <Calendar className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>

                {/* Mess Information */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-b-lg">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-primary" />
                      Mess Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-gray-600">Status</span>
                        </div>
                        <span className="font-medium text-green-600">
                          {mess?.isActive ? 'Available Now' : 'Coming Soon'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-gray-600">Distance</span>
                        </div>
                        <span className="font-medium text-gray-700">
                          {mess?.distanceFromDTU}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MessDetails;
