import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, IndianRupee, Gamepad2, Users, Trophy, Wifi, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GamingZone = () => {
  const [selectedZone, setSelectedZone] = useState(null);

  const gamingZones = [
    {
      id: 1,
      name: "GameZone Pro",
      location: "Indiranagar, Bangalore",
      rating: 4.9,
      reviews: 234,
      hourlyRate: 100,
      monthlyMembership: 2500,
      games: ["PS5", "PC Gaming", "VR Games", "Xbox Series X", "Nintendo Switch"],
      specialGames: ["FIFA 24", "Call of Duty", "Valorant", "PUBG", "Fortnite"],
      amenities: ["AC", "High-Speed Internet", "Gaming Chairs", "Snacks Available"],
      timings: "10:00 AM - 12:00 AM",
      features: ["Tournament Hosting", "Group Bookings", "Birthday Parties"],
      totalStations: 20,
      maxCapacity: 50,
      badge: "Most Popular",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      name: "Elite Gaming Arena",
      location: "Koramangala, Bangalore",
      rating: 4.7,
      reviews: 189,
      hourlyRate: 120,
      monthlyMembership: 3000,
      games: ["High-End PCs", "PS5", "VR Setup", "Racing Simulators"],
      specialGames: ["Cyberpunk 2077", "Elden Ring", "Red Dead Redemption", "GTA V"],
      amenities: ["Premium AC", "RGB Setup", "Gaming Headsets", "Cafe Inside"],
      timings: "11:00 AM - 1:00 AM",
      features: ["Esports Training", "Streaming Setup", "Private Rooms"],
      totalStations: 15,
      maxCapacity: 35,
      badge: "Premium",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      name: "Retro Gaming Hub",
      location: "HSR Layout, Bangalore",
      rating: 4.5,
      reviews: 156,
      hourlyRate: 80,
      monthlyMembership: 2000,
      games: ["Retro Consoles", "Arcade Games", "PS4", "PC Gaming", "Board Games"],
      specialGames: ["Street Fighter", "Tekken", "Mario Kart", "Pac-Man", "Chess"],
      amenities: ["AC", "Retro Ambiance", "Snack Counter", "Board Game Library"],
      timings: "12:00 PM - 11:00 PM",
      features: ["Retro Tournaments", "Birthday Specials", "Group Activities"],
      totalStations: 25,
      maxCapacity: 60,
      badge: "Family Friendly",
      image: "/api/placeholder/400/300"
    },
    {
      id: 4,
      name: "Cyber Sports Zone",
      location: "Electronic City, Bangalore",
      rating: 4.6,
      reviews: 198,
      hourlyRate: 90,
      monthlyMembership: 2200,
      games: ["Gaming PCs", "PS5", "Mobile Gaming", "VR Headsets"],
      specialGames: ["BGMI", "Free Fire", "CS:GO", "Dota 2", "League of Legends"],
      amenities: ["AC", "High-Speed WiFi", "Mobile Charging", "Energy Drinks"],
      timings: "9:00 AM - 11:00 PM",
      features: ["Mobile Tournaments", "Team Building", "Coaching Available"],
      totalStations: 30,
      maxCapacity: 75,
      badge: "Best Value",
      image: "/api/placeholder/400/300"
    }
  ];

  const popularGames = [
    { name: "FIFA 24", category: "Sports", platforms: ["PS5", "PC"] },
    { name: "Call of Duty", category: "Shooter", platforms: ["PS5", "PC", "Xbox"] },
    { name: "Valorant", category: "Tactical Shooter", platforms: ["PC"] },
    { name: "PUBG", category: "Battle Royale", platforms: ["PC", "Mobile"] },
    { name: "Fortnite", category: "Battle Royale", platforms: ["PC", "PS5"] },
    { name: "GTA V", category: "Action", platforms: ["PC", "PS5"] }
  ];

  const badgeColors = {
    "Most Popular": "bg-primary text-primary-foreground",
    "Premium": "bg-accent text-accent-foreground",
    "Family Friendly": "bg-secondary text-secondary-foreground",
    "Best Value": "bg-success text-success-foreground"
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
              Gaming Zones & Entertainment
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Play the latest games, join tournaments, and enjoy premium gaming experiences
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Search location..." className="bg-white" />
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Game Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pc">PC Gaming</SelectItem>
                    <SelectItem value="console">Console Gaming</SelectItem>
                    <SelectItem value="vr">VR Gaming</SelectItem>
                    <SelectItem value="mobile">Mobile Gaming</SelectItem>
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
            <h2 className="text-2xl font-bold">Found {gamingZones.length} Gaming Zones</h2>
            <p className="text-muted-foreground">Premium gaming experiences in Bangalore</p>
          </div>
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

        {/* Gaming Zones Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {gamingZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative">
                <div className="aspect-[16/10] bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gamepad2 className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                
                {/* Badge */}
                <Badge className={`absolute top-4 left-4 ${badgeColors[zone.badge]} font-semibold`}>
                  {zone.badge}
                </Badge>

                {/* Capacity */}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded-full">
                  {zone.totalStations} stations
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {zone.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{zone.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Capacity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{zone.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      ({zone.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Max {zone.maxCapacity}</span>
                  </div>
                </div>

                {/* Games Available */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Available Games:</h4>
                  <div className="flex flex-wrap gap-2">
                    {zone.games.slice(0, 4).map((game, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {game}
                      </Badge>
                    ))}
                    {zone.games.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{zone.games.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {zone.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {zone.amenities.slice(0, 3).map((amenity, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                {/* Timings */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Open: {zone.timings}</span>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-primary">
                        ₹{zone.hourlyRate}
                      </div>
                      <div className="text-muted-foreground">per hour</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-secondary">
                        ₹{zone.monthlyMembership}
                      </div>
                      <div className="text-muted-foreground">monthly</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button className="hover-glow">
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Slot
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Booking Slots Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Available Time Slots Today</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gamezonepro" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  {gamingZones.map((zone) => (
                    <TabsTrigger key={zone.id} value={zone.name.toLowerCase().replace(/\s+/g, '')}>
                      {zone.name.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {gamingZones.map((zone) => (
                  <TabsContent key={zone.id} value={zone.name.toLowerCase().replace(/\s+/g, '')} className="mt-6">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {[
                        "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
                        "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
                        "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
                        "10:00 PM", "11:00 PM"
                      ].map((time, index) => (
                        <Button
                          key={index}
                          variant={Math.random() > 0.3 ? "outline" : "destructive"}
                          disabled={Math.random() > 0.3 ? false : true}
                          className="text-xs p-2 h-auto"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Select your preferred time slot. Red slots are booked.
                    </p>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="hover:bg-gradient-primary hover:text-white">
            Load More Gaming Zones
          </Button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default GamingZone;