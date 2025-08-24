import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, MapPin, Wifi, Car, Users, Utensils, Clock, 
  IndianRupee, Phone, Share2, Heart, Calendar, User, Check, X,
  Bed, Bath, Home, Shield, Zap, ChevronLeft, ChevronRight
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
import { propertyAPI } from "@/services/api";
import { Property } from "@/types";
import PropertyImage from "@/components/common/PropertyImage";
import PropertyAmenities from "@/components/common/PropertyAmenities";
import { getAvailableAmenities, getAvailableRoomTypes, amenityConfig, roomTypeConfig } from "@/utils/propertyUtils";
import { createBookingMessage, createWhatsAppURL } from "@/utils/whatsappConfig";
import { toast } from "sonner";

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    mobile: '',
    email: '',
    roomType: '',
    moveInDate: '',
    message: ''
  });

  // Get all photos from different sources
  const getAllPhotos = (property: Property | null): string[] => {
    if (!property) return [];
    
    const allPhotos: string[] = [];
    
    // Add cover photo first (if exists)
    if (property.coverPhoto) {
      allPhotos.push(property.coverPhoto);
    }
    
    // Add facility photos
    if (property.facilityPhotos && property.facilityPhotos.length > 0) {
      allPhotos.push(...property.facilityPhotos.filter(photo => photo && photo.trim() !== ''));
    }
    
    // Add legacy pics (if no cover photo, or as additional photos)
    if (property.pics && property.pics.length > 0) {
      // If we already have a cover photo, don't duplicate the first pic
      const picsToAdd = property.coverPhoto ? property.pics : property.pics;
      allPhotos.push(...picsToAdd.filter(pic => pic && pic.trim() !== ''));
    }
    
    // Remove duplicates
    return [...new Set(allPhotos)];
  };

  const allPhotos = getAllPhotos(property);

  // Fetch property data
  useEffect(() => {
    // Ensure page starts from top when component mounts
    window.scrollTo(0, 0);
    
    const fetchProperty = async () => {
      if (!id) {
        console.log('❌ No property ID provided');
        navigate('/pg-hostels');
        return;
      }

      try {
        console.log('🔍 Fetching property with ID:', id);
        setLoading(true);
        const response = await propertyAPI.getPropertyById(id);
        console.log('✅ Property data received:', response.data);
        // Backend returns { property: ... }, so we need to access response.data.property
        setProperty(response.data.property);
      } catch (error: any) {
        console.error('❌ Error fetching property:', error);
        console.error('Error response:', error.response?.data);
        toast.error('Property not found');
        navigate('/pg-hostels');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
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
    // Validate required fields
    if (!bookingForm.name || !bookingForm.mobile || !bookingForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!property) {
      toast.error('Property information not available');
      return;
    }

    // Create message using utility function
    const message = createBookingMessage(property, bookingForm);
    
    // Create WhatsApp URL
    const whatsappURL = createWhatsAppURL(message);
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Close dialog and show success message
    setIsBookingOpen(false);
    toast.success('Redirecting to WhatsApp...');
    
    // Reset form
    setBookingForm({
      name: '',
      mobile: '',
      email: '',
      roomType: '',
      moveInDate: '',
      message: ''
    });
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
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property not found</h2>
            <p className="text-muted-foreground mb-4">
              Property ID: {id || 'No ID provided'}
            </p>
            <Button onClick={() => navigate('/pg-hostels')}>
              Back to Listings
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const amenityIcons = {
    "WiFi": Wifi,
    "RO Water": IndianRupee,
    "Electricity Included": Zap,
    "24/7 Security": Shield,
    "AC Rooms": Home,
    "Attached Bathroom": Bath,
    "Study Table": Bed,
    "Wardrobe": Home,
    "Daily Cleaning": Users,
    "Laundry Service": Users,
    "Maintenance Support": Users,
    "Parking": Car,
    "Common Area": Users,
    "Backup Power": Zap,
    "CCTV": Shield
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/pg-hostels')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to PG Listings
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
                    alt={property?.title || 'Property Image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-muted-foreground" />
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
                
                {/* Photo type indicator */}
                {allPhotos.length > 0 && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex === 0 && property?.coverPhoto ? 'Cover Photo' : 
                     currentImageIndex < (property?.coverPhoto ? 1 : 0) + (property?.facilityPhotos?.length || 0) ? 'Facility' : 'Gallery'}
                  </div>
                )}
              </div>
              
              {/* Property Description */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">About this Property</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property?.description || "No description available for this property."}
                </p>
              </div>
            </motion.div>

            {/* Property Info */}
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
                    <h1 className="text-3xl font-bold">{property?.title}</h1>
                    <Badge className="bg-success text-success-foreground">
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <span>{property?.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-success text-success-foreground">
                      {property?.isActive ? 'Available' : 'Not Available'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Listed on {new Date(property?.createdAt || '').toLocaleDateString()}
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
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Property</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {property.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Key Highlights</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Monthly rent: ₹{property.price.toLocaleString()}
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Verified property listing
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Available for immediate booking
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Property Details</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Property Type: PG/Hostel</li>
                            <li>• Status: {property.isActive ? 'Available' : 'Not Available'}</li>
                            <li>• Listed: {new Date(property.createdAt).toLocaleDateString()}</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6">
                  {(() => {
                    const availableAmenities = getAvailableAmenities(property);
                    const allAmenities = Object.entries(amenityConfig);
                    const unavailableAmenities = allAmenities.filter(
                      ([key]) => !property.amenities?.[key as keyof typeof property.amenities]
                    );

                    return (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Included Amenities */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-green-700 flex items-center gap-2">
                              <Check className="h-5 w-5" />
                              Included Amenities ({availableAmenities.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {availableAmenities.length > 0 ? (
                              <div className="space-y-3">
                                {availableAmenities.map((amenity) => (
                                  <div key={amenity.key} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                                    <span className="text-lg">{amenity.icon}</span>
                                    <span className="text-sm font-medium text-green-800">{amenity.label}</span>
                                    <Check className="h-4 w-4 text-green-600 ml-auto" />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No amenities specified for this property.</p>
                            )}
                          </CardContent>
                        </Card>

                        {/* Excluded Amenities */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-red-700 flex items-center gap-2">
                              <X className="h-5 w-5" />
                              Not Available ({unavailableAmenities.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {unavailableAmenities.length > 0 ? (
                              <div className="space-y-3">
                                {unavailableAmenities.map(([key, config]) => (
                                  <div key={key} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                                    <span className="text-lg grayscale">{config.icon}</span>
                                    <span className="text-sm font-medium text-red-800">{config.label}</span>
                                    <X className="h-4 w-4 text-red-600 ml-auto" />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">All amenities are available!</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}
                </TabsContent>

                <TabsContent value="rooms" className="space-y-6">
                  {(() => {
                    const availableRoomTypes = getAvailableRoomTypes(property);
                    
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Available Room Types</h3>
                          <span className="text-sm text-muted-foreground">
                            {availableRoomTypes.length} type(s) available
                          </span>
                        </div>
                        
                        {availableRoomTypes.length > 0 ? (
                          <div className="grid gap-4">
                            {availableRoomTypes.map((roomType) => (
                              <Card key={roomType.key}>
                                <CardContent className="p-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">{roomType.icon}</span>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">{roomType.label} Room</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {roomType.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-2xl font-bold text-primary">
                                        ₹{property.price.toLocaleString()}
                                      </div>
                                      <div className="text-sm text-muted-foreground">per month</div>
                                    </div>
                                  </div>
                                  
                                  {/* Show dormitory members if it's a dormitory room and members exist */}
                                  {roomType.key === 'dormitory' && property.dormitoryMembers && property.dormitoryMembers.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Current Residents ({property.dormitoryMembers.length})
                                      </h4>
                                      <div className="space-y-3">
                                        {property.dormitoryMembers.map((member, index) => (
                                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                              <div>
                                                <span className="font-medium text-gray-700">Name:</span>
                                                <p className="text-gray-900">{member.fullName}</p>
                                              </div>
                                              <div>
                                                <span className="font-medium text-gray-700">Year:</span>
                                                <p className="text-gray-900">{member.year}</p>
                                              </div>
                                              <div>
                                                <span className="font-medium text-gray-700">State:</span>
                                                <p className="text-gray-900">{member.state}</p>
                                              </div>
                                              <div>
                                                <span className="font-medium text-gray-700">Branch:</span>
                                                <p className="text-gray-900">{member.branch}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                          💡 <strong>Note:</strong> This is a shared accommodation. You'll be staying with the residents listed above.
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <Card>
                            <CardContent className="p-6 text-center">
                              <div className="text-muted-foreground">
                                <Bed className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No specific room types specified for this property.</p>
                                <p className="text-sm mt-2">Contact the owner for room details.</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    );
                  })()}
                </TabsContent>

                <TabsContent value="policies" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>House Rules</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="capitalize">Smoking</span>
                          <X className="h-4 w-4 text-destructive" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="capitalize">Alcohol</span>
                          <X className="h-4 w-4 text-destructive" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="capitalize">Guests Allowed</span>
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="capitalize">Opposite Gender</span>
                          <X className="h-4 w-4 text-destructive" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Timings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="capitalize font-medium">Entry Hours:</span>
                          <span className="text-muted-foreground">6:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="capitalize font-medium">Guest Hours:</span>
                          <span className="text-muted-foreground">10:00 AM - 8:00 PM</span>
                        </div>
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
                {/* PG Name Header with Gradient */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-lg">
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">
                      {property?.title}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
                      <span className="text-sm">{property?.location}</span>
                    </div>
                  </div>
                </div>

                {/* Price Section with Enhanced Styling */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b">
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{property?.price?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-green-700 font-medium text-sm">per month</p>
                    </div>
                  </div>
                </div>

                {/* Booking Section */}
                <div className="p-6 space-y-4">
                  <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Book Your Stay</DialogTitle>
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
                        <Label htmlFor="room-type">Room Type</Label>
                        <Select value={bookingForm.roomType} onValueChange={(value) => handleFormChange('roomType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const availableRoomTypes = getAvailableRoomTypes(property);
                              if (availableRoomTypes.length > 0) {
                                return availableRoomTypes.map((roomType) => (
                                  <SelectItem key={roomType.key} value={roomType.key}>
                                    {roomType.label} Room - ₹{property?.price?.toLocaleString()}
                                  </SelectItem>
                                ));
                              } else {
                                return (
                                  <SelectItem value="standard">
                                    Standard Room - ₹{property?.price?.toLocaleString()}
                                  </SelectItem>
                                );
                              }
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Move-in Date</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={bookingForm.moveInDate}
                          onChange={(e) => handleFormChange('moveInDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Any special requirements..." 
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

                  {/* Action Buttons with Enhanced Styling */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-primary/20 hover:border-primary hover:bg-primary/5 transition-colors duration-200">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    
                    <Button variant="outline" className="border-primary/20 hover:border-primary hover:bg-primary/5 transition-colors duration-200">
                      <Calendar className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>

                {/* Property Information with Enhanced Design */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-b-lg">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      Property Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-gray-600">Status</span>
                        </div>
                        <span className="font-medium text-green-600">
                          {property?.isActive ? 'Available Now' : 'Coming Soon'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-gray-600">Listed</span>
                        </div>
                        <span className="font-medium text-gray-700">
                          {new Date(property?.createdAt || '').toLocaleDateString()}
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

export default PGDetails;