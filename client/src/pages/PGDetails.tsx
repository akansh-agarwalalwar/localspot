import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, MapPin, Wifi, Car, Users, Utensils, Clock, 
  IndianRupee, Phone, Share2, Heart, Calendar, User, Check, X,
  Bed, Bath, Home, Shield, Zap
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

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Mock data - in real app, fetch based on id
  const pgData = {
    id: 1,
    name: "Green Valley PG",
    location: "Koramangala, Bangalore",
    fullAddress: "123, 4th Block, Koramangala, Bangalore - 560034",
    rating: 4.8,
    reviews: 156,
    price: 8500,
    originalPrice: 10000,
    discount: 15,
    verified: true,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
    ],
    roomTypes: [
      { type: "Single AC", price: 8500, available: 3 },
      { type: "Double AC", price: 6500, available: 5 },
      { type: "Single Non-AC", price: 7000, available: 2 },
      { type: "Double Non-AC", price: 5500, available: 4 },
    ],
    amenities: {
      basic: ["WiFi", "RO Water", "Electricity Included", "24/7 Security"],
      comfort: ["AC Rooms", "Attached Bathroom", "Study Table", "Wardrobe"],
      services: ["Daily Cleaning", "Laundry Service", "Maintenance Support"],
      facilities: ["Parking", "Common Area", "Backup Power", "CCTV"]
    },
    mess: {
      included: true,
      type: "Veg & Non-Veg",
      timings: {
        breakfast: "7:30 AM - 9:30 AM",
        lunch: "12:30 PM - 2:30 PM",
        dinner: "7:30 PM - 9:30 PM"
      },
      menuHighlights: ["North & South Indian", "Fresh Vegetables", "Hygienic Kitchen"]
    },
    timings: {
      gate: "24/7 Access",
      office: "9:00 AM - 7:00 PM",
      visitors: "9:00 AM - 9:00 PM"
    },
    policies: {
      smoking: false,
      alcohol: false,
      pets: false,
      visitors: true,
      lockIn: "None"
    },
    contact: {
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      email: "contact@greenvalleypg.com"
    },
    coordinates: { lat: 12.9352, lng: 77.6245 }
  };

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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {pgData.images.length}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {pgData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-muted rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                  </button>
                ))}
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
                    <h1 className="text-3xl font-bold">{pgData.name}</h1>
                    {pgData.verified && (
                      <Badge className="bg-success text-success-foreground">
                        Verified
                      </Badge>
                    )}
                    {pgData.discount && (
                      <Badge className="bg-destructive text-destructive-foreground">
                        {pgData.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{pgData.fullAddress}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-lg">{pgData.rating}</span>
                      <span className="text-muted-foreground">({pgData.reviews} reviews)</span>
                    </div>
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
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                  <TabsTrigger value="mess">Mess</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This PG</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        Green Valley PG offers comfortable and affordable accommodation in the heart of Koramangala. 
                        With modern amenities, clean facilities, and a homely environment, it's perfect for working 
                        professionals and students. The property features well-furnished rooms, nutritious mess food, 
                        and 24/7 security for a safe and convenient stay.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Key Highlights</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Prime location in Koramangala
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Fully furnished rooms
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              Hygienic mess facility
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              24/7 security & CCTV
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Nearby Landmarks</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Forum Mall - 500m</li>
                            <li>• Koramangala Metro - 800m</li>
                            <li>• Hospitals - 1.2km</li>
                            <li>• Banks & ATMs - 300m</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(pgData.amenities).map(([category, items]) => (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="capitalize">{category.replace('_', ' ')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {items.map((amenity, index) => {
                              const Icon = amenityIcons[amenity] || Check;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <Icon className="h-4 w-4 text-primary" />
                                  <span className="text-sm">{amenity}</span>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="rooms" className="space-y-6">
                  <div className="grid gap-4">
                    {pgData.roomTypes.map((room, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                                <Bed className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{room.type}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {room.available} rooms available
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                ₹{room.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">per month</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="mess" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mess Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Meal Timings</h4>
                          <div className="space-y-2">
                            {Object.entries(pgData.mess.timings).map(([meal, time]) => (
                              <div key={meal} className="flex justify-between">
                                <span className="capitalize font-medium">{meal}:</span>
                                <span className="text-muted-foreground">{time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Menu Highlights</h4>
                          <ul className="space-y-2">
                            {pgData.mess.menuHighlights.map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-success" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Utensils className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Mess Type: {pgData.mess.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Nutritious and hygienic meals prepared with fresh ingredients in our in-house kitchen.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="policies" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>House Rules</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(pgData.policies).map(([policy, allowed]) => (
                          <div key={policy} className="flex items-center justify-between">
                            <span className="capitalize">{policy.replace(/([A-Z])/g, ' $1').trim()}</span>
                            {typeof allowed === 'boolean' ? (
                              allowed ? (
                                <Check className="h-4 w-4 text-success" />
                              ) : (
                                <X className="h-4 w-4 text-destructive" />
                              )
                            ) : (
                              <span className="text-muted-foreground">{allowed}</span>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Timings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(pgData.timings).map(([timing, time]) => (
                          <div key={timing} className="flex justify-between">
                            <span className="capitalize font-medium">{timing} Hours:</span>
                            <span className="text-muted-foreground">{time}</span>
                          </div>
                        ))}
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
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{pgData.price.toLocaleString()}
                    </span>
                    {pgData.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{pgData.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">per month</p>
                </div>

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book Your Stay</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter your full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" placeholder="Enter your mobile number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="room-type">Room Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {pgData.roomTypes.map((room, index) => (
                              <SelectItem key={index} value={room.type}>
                                {room.type} - ₹{room.price.toLocaleString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Move-in Date</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Message</Label>
                        <Textarea id="message" placeholder="Any special requirements..." />
                      </div>
                      <Button className="w-full bg-gradient-primary hover:opacity-90">
                        Submit Booking Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Owner
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Visit
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{pgData.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{pgData.contact.email}</span>
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