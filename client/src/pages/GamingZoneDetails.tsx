import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, MapPin, Wifi, Car, Users, Utensils, Clock, 
  IndianRupee, Phone, Share2, Heart, Calendar, User, Check, X,
  Bed, Bath, Home, Shield, Zap, ChevronLeft, ChevronRight, Gamepad2
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
import { gamingZoneAPI } from "@/services/api";
import { GamingZone } from "@/types";
import { toast } from "sonner";

const GamingZoneDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [gamingZone, setGamingZone] = useState<GamingZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    mobile: '',
    email: '',
    gameType: '',
    preferredTime: '',
    message: ''
  });

  // Convert Google Drive URLs to direct view URLs
  const convertGoogleDriveUrl = (url: string): string => {
    if (!url) return '';
    
    // Check if it's a Google Drive share URL
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url;
  };

  // Get all photos from different sources
  const getAllPhotos = (gamingZone: GamingZone | null): string[] => {
    if (!gamingZone) return [];
    
    const allPhotos: string[] = [];
    
    // Add cover photo first (if exists)
    if (gamingZone.coverPhoto) {
      allPhotos.push(convertGoogleDriveUrl(gamingZone.coverPhoto));
    }
    
    // Add additional images
    if (gamingZone.images && gamingZone.images.length > 0) {
      const convertedImages = gamingZone.images
        .filter(image => image && image.trim() !== '')
        .map(image => convertGoogleDriveUrl(image));
      allPhotos.push(...convertedImages);
    }
    
    // Remove duplicates
    return [...new Set(allPhotos)];
  };

  const allPhotos = getAllPhotos(gamingZone);

  // Fetch gaming zone data
  useEffect(() => {
    // Ensure page starts from top when component mounts
    window.scrollTo(0, 0);
    
    const fetchGamingZone = async () => {
      if (!id) {
        console.log('❌ No gaming zone ID provided');
        navigate('/gaming-zone');
        return;
      }

      try {
        console.log('🔍 Fetching gaming zone with ID:', id);
        setLoading(true);
        const response = await gamingZoneAPI.getGamingZoneById(id);
        console.log('✅ Gaming zone data received:', response.data);
        
        // Backend returns { success: true, gamingZone: {...} }
        if (response.data.success && response.data.gamingZone) {
          setGamingZone(response.data.gamingZone);
          console.log('🎮 Gaming zone set to state:', response.data.gamingZone);
        } else {
          console.error('❌ Invalid response format:', response.data);
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        console.error('❌ Error fetching gaming zone:', error);
        console.error('Error response:', error.response?.data);
        toast.error('Gaming zone not found');
        navigate('/gaming-zone');
      } finally {
        setLoading(false);
      }
    };

    fetchGamingZone();
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

    if (!gamingZone) {
      toast.error('Gaming zone information not available');
      return;
    }

    // Create booking message
    const message = `🎮 *Gaming Zone Booking Request*

*Gaming Zone:* ${gamingZone.title}
*Location:* ${gamingZone.location}
*Hourly Rate:* ₹${gamingZone.hourlyPrice}
*Monthly Rate:* ₹${gamingZone.monthlyPrice}

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
    
    // Reset form
    setBookingForm({
      name: '',
      mobile: '',
      email: '',
      gameType: '',
      preferredTime: '',
      message: ''
    });
  };

  // Get available amenities with icons
  const getAvailableAmenities = (gamingZone: GamingZone | null) => {
    if (!gamingZone || !gamingZone.amenities) return [];
    
    const amenityConfig = {
      ac: { label: 'Air Conditioning', icon: '❄️' },
      gamingConsole: { label: 'Gaming Console', icon: '🎮' },
      ps5: { label: 'PlayStation 5', icon: '🎯' },
      xbox: { label: 'Xbox', icon: '🎲' },
      wifi: { label: 'WiFi', icon: '📶' },
      parking: { label: 'Parking', icon: '🅿️' },
      powerBackup: { label: 'Power Backup', icon: '🔋' },
      cctv: { label: 'CCTV Security', icon: '📹' },
    };

    return Object.entries(gamingZone.amenities)
      .filter(([_, value]) => value)
      .map(([key, _]) => ({
        key,
        label: amenityConfig[key as keyof typeof amenityConfig]?.label || key,
        icon: amenityConfig[key as keyof typeof amenityConfig]?.icon || '✓'
      }));
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
            <p className="text-muted-foreground">Loading gaming zone details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!gamingZone) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Gaming Zone not found</h2>
            <p className="text-muted-foreground mb-4">
              Gaming Zone ID: {id || 'No ID provided'}
            </p>
            <Button onClick={() => navigate('/gaming-zone')}>
              Back to Gaming Zones
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const availableAmenities = getAvailableAmenities(gamingZone);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/gaming-zone')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gaming Zones
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
                  <img 
                    src={allPhotos[currentImageIndex]} 
                    alt={gamingZone?.title || 'Gaming Zone Image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', allPhotos[currentImageIndex]);
                      // Hide broken image and show placeholder
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback placeholder - always present but hidden when image loads */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center"
                  style={{ display: allPhotos.length > 0 ? 'none' : 'flex' }}
                >
                  <div className="text-center">
                    <Gamepad2 className="h-16 w-16 text-purple-400 mx-auto mb-2" />
                    <p className="text-purple-600 font-medium">{gamingZone?.title || 'Gaming Zone'}</p>
                  </div>
                </div>
                
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
                
                {/* Gaming zone type indicator */}
                {allPhotos.length > 0 && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex === 0 && gamingZone?.coverPhoto ? 'Cover Photo' : 'Gallery'}
                  </div>
                )}
              </div>
              
              {/* Gaming Zone Description */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">About this Gaming Zone</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {gamingZone?.description || "No description available for this gaming zone."}
                </p>
              </div>
            </motion.div>

            {/* Gaming Zone Info */}
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
                    <h1 className="text-3xl font-bold">{gamingZone?.title}</h1>
                    <Badge className="bg-purple-600 text-white">
                      Gaming Zone
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{gamingZone?.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-success text-success-foreground">
                      {gamingZone?.isActive ? 'Available' : 'Closed'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Listed on {new Date(gamingZone?.createdAt || '').toLocaleDateString()}
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Gaming Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {gamingZone?.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Key Highlights</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Hourly rate: ₹{gamingZone?.hourlyPrice}
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Monthly membership: ₹{gamingZone?.monthlyPrice}
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Available for immediate booking
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Gaming Zone Details</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Type: Gaming Zone</li>
                            <li>• Status: {gamingZone?.isActive ? 'Available' : 'Closed'}</li>
                            <li>• Listed: {new Date(gamingZone?.createdAt || '').toLocaleDateString()}</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Available Amenities */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-700 flex items-center gap-2">
                          <Check className="h-5 w-5" />
                          Available Amenities ({availableAmenities.length})
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
                          <p className="text-sm text-muted-foreground">No specific amenities listed for this gaming zone.</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Gaming Features */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-purple-700 flex items-center gap-2">
                          <Gamepad2 className="h-5 w-5" />
                          Gaming Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                            <span className="text-lg">🎮</span>
                            <span className="text-sm font-medium text-purple-800">Latest Gaming Consoles</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                            <span className="text-lg">🎯</span>
                            <span className="text-sm font-medium text-purple-800">Multiplayer Gaming</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                            <span className="text-lg">🏆</span>
                            <span className="text-sm font-medium text-purple-800">Tournament Support</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                            <span className="text-lg">🥤</span>
                            <span className="text-sm font-medium text-purple-800">Refreshments Available</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                          Hourly Pricing
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            ₹{gamingZone?.hourlyPrice}
                          </div>
                          <p className="text-muted-foreground">per hour</p>
                          <div className="mt-4 text-sm text-muted-foreground">
                            Perfect for casual gaming sessions
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          Monthly Membership
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            ₹{gamingZone?.monthlyPrice}
                          </div>
                          <p className="text-muted-foreground">per month</p>
                          <div className="mt-4 text-sm text-muted-foreground">
                            Best value for regular gamers
                          </div>
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
                {/* Gaming Zone Name Header with Gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">
                      {gamingZone?.title}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-purple-100">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{gamingZone?.location}</span>
                    </div>
                  </div>
                </div>

                {/* Price Section with Enhanced Styling */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-b">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{gamingZone?.hourlyPrice}
                      </div>
                      <p className="text-purple-700 font-medium text-sm">per hour</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{gamingZone?.monthlyPrice}
                      </div>
                      <p className="text-green-700 font-medium text-sm">per month</p>
                    </div>
                  </div>
                </div>

                {/* Booking Section */}
                <div className="p-6 space-y-4">
                  <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Gaming Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Book Gaming Session</DialogTitle>
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
                          <Label htmlFor="game-type">Preferred Game</Label>
                          <Select value={bookingForm.gameType} onValueChange={(value) => handleFormChange('gameType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select game type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fifa">FIFA 24</SelectItem>
                              <SelectItem value="cod">Call of Duty</SelectItem>
                              <SelectItem value="valorant">Valorant</SelectItem>
                              <SelectItem value="pubg">PUBG</SelectItem>
                              <SelectItem value="fortnite">Fortnite</SelectItem>
                              <SelectItem value="gta">GTA V</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
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
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          onClick={handleSubmitBooking}
                        >
                          Submit Booking Request via WhatsApp
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Action Buttons with Enhanced Styling */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    
                    <Button variant="outline" className="border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200">
                      <MapPin className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>

                {/* Gaming Zone Information with Enhanced Design */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-b-lg">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4 text-purple-600" />
                      Gaming Zone Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-gray-600">Status</span>
                        </div>
                        <span className="font-medium text-green-600">
                          {gamingZone?.isActive ? 'Available Now' : 'Coming Soon'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-gray-600">Listed</span>
                        </div>
                        <span className="font-medium text-gray-700">
                          {new Date(gamingZone?.createdAt || '').toLocaleDateString()}
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

export default GamingZoneDetails;
