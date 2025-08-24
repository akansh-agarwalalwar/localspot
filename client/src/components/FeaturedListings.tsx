import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Car, Users, Camera, ChevronLeft, ChevronRight, Gamepad2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { propertyAPI, messAPI, gamingZoneAPI } from "@/services/api";
import { Property, Mess, GamingZone } from "@/types";
import PropertyImage from "@/components/common/PropertyImage";
import { useNavigate } from "react-router-dom";
import { getListingAmenities, getListingRoomTypes, getAmenityBadgeColor, getRoomTypeBadgeColor } from "@/utils/amenityUtils";

// Combined type for all listing types
type FeaturedListing = {
  _id: string;
  title: string;
  location: string;
  price?: number;
  monthlyPrice?: number;
  hourlyPrice?: number;
  coverPhoto?: string;
  pics?: string[];
  images?: string[];
  facilityPhotos?: string[];
  type: 'pg' | 'mess' | 'gaming';
  originalData: Property | Mess | GamingZone;
};

const FeaturedListings = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [listings, setListings] = useState<FeaturedListing[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "pg", label: "PGs & Flats" },
    { id: "mess", label: "Mess & Cafes" },
    { id: "gaming", label: "Gaming Zones" },
  ];

  // Helper function to convert different data types to unified format
  const convertToFeaturedListing = (data: any, type: 'pg' | 'mess' | 'gaming'): FeaturedListing => {
    return {
      _id: data._id,
      title: data.title,
      location: data.location,
      price: data.price,
      monthlyPrice: data.monthlyPrice,
      hourlyPrice: data.hourlyPrice,
      coverPhoto: data.coverPhoto,
      pics: data.pics,
      images: data.images,
      facilityPhotos: data.facilityPhotos,
      type,
      originalData: data
    };
  };

  // Fetch data based on active category
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        let allListings: FeaturedListing[] = [];

        if (activeCategory === "all") {
          // Fetch all types of data
          const [pgResponse, messResponse, gamingResponse] = await Promise.all([
            propertyAPI.getAllProperties({ limit: 2 }).catch(() => ({ data: { properties: [] } })),
            messAPI.getAllMesses({ limit: 2 }).catch(() => ({ data: { messes: [] } })),
            gamingZoneAPI.getAllGamingZones({ limit: 2 }).catch(() => ({ data: { gamingZones: [] } }))
          ]);

          // Convert and combine all data
          const pgListings = (pgResponse.data.properties || []).map((pg: Property) => 
            convertToFeaturedListing(pg, 'pg')
          );
          const messListings = (messResponse.data.messes || []).map((mess: Mess) => 
            convertToFeaturedListing(mess, 'mess')
          );
          const gamingListings = (gamingResponse.data.gamingZones || []).map((gaming: GamingZone) => 
            convertToFeaturedListing(gaming, 'gaming')
          );

          allListings = [...pgListings, ...messListings, ...gamingListings];
        } else if (activeCategory === "pg") {
          const response = await propertyAPI.getAllProperties({ limit: 6 });
          allListings = (response.data.properties || []).map((pg: Property) => 
            convertToFeaturedListing(pg, 'pg')
          );
        } else if (activeCategory === "mess") {
          const response = await messAPI.getAllMesses({ limit: 6 });
          allListings = (response.data.messes || []).map((mess: Mess) => 
            convertToFeaturedListing(mess, 'mess')
          );
        } else if (activeCategory === "gaming") {
          const response = await gamingZoneAPI.getAllGamingZones({ limit: 6 });
          allListings = (response.data.gamingZones || []).map((gaming: GamingZone) => 
            convertToFeaturedListing(gaming, 'gaming')
          );
        }

        setListings(allListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeCategory]);

  // Helper function to get the appropriate navigation path
  const getNavigationPath = (listing: FeaturedListing): string => {
    switch (listing.type) {
      case 'pg':
        return `/pg-details/${listing._id}`;
      case 'mess':
        return `/mess-details/${listing._id}`;
      case 'gaming':
        return `/gaming-zone-details/${listing._id}`;
      default:
        return '#';
    }
  };

  // Helper function to get the appropriate badge text and color
  const getBadgeInfo = (listing: FeaturedListing) => {
    switch (listing.type) {
      case 'pg':
        return { text: 'PG', className: 'bg-blue-100 text-blue-800' };
      case 'mess':
        return { text: 'Mess', className: 'bg-green-100 text-green-800' };
      case 'gaming':
        return { text: 'Gaming', className: 'bg-purple-100 text-purple-800' };
      default:
        return { text: 'Listing', className: 'bg-gray-100 text-gray-800' };
    }
  };

  // Helper function to get pricing display
  const getPricingDisplay = (listing: FeaturedListing) => {
    if (listing.type === 'gaming') {
      return {
        price: listing.hourlyPrice || 0,
        period: 'per hour',
        subtitle: listing.monthlyPrice ? `₹${listing.monthlyPrice}/month` : null
      };
    } else if (listing.type === 'mess') {
      return {
        price: listing.monthlyPrice || 0,
        period: 'per month',
        subtitle: null
      };
    } else {
      return {
        price: listing.price || 0,
        period: 'per month',
        subtitle: null
      };
    }
  };

  // Helper function to get appropriate features with real data
  const getFeatures = (listing: FeaturedListing): Array<{key: string, label: string, icon: string, badgeColor: string}> => {
    const amenities = getListingAmenities(listing.originalData, listing.type);
    const features = amenities.slice(0, 4).map(amenity => ({
      ...amenity,
      badgeColor: getAmenityBadgeColor(listing.type)
    }));
    
    // For PG properties, also add room types if available
    if (listing.type === 'pg') {
      const property = listing.originalData as Property;
      const roomTypes = getListingRoomTypes(property);
      const roomFeatures = roomTypes.slice(0, 2).map(room => ({
        key: room.key,
        label: room.label,
        icon: room.icon,
        badgeColor: getRoomTypeBadgeColor()
      }));
      
      // Combine amenities and room types, but limit to 4 total
      const allFeatures = [...features, ...roomFeatures];
      return allFeatures.slice(0, 4);
    }
    
    return features;
  };

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
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4">
            Featured{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Listings
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 lg:mb-8 px-4">
            Handpicked accommodations and services with the best ratings and reviews
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                size="sm"
                className={`transition-all duration-300 text-xs sm:text-sm ${
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-card rounded-xl lg:rounded-2xl p-4 lg:p-6 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-5 lg:h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 lg:h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : listings.length === 0 ? (
            <div className="col-span-full text-center py-8 lg:py-12">
              <div className="max-w-md mx-auto px-4">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
                <p className="text-sm lg:text-base text-gray-500">Check back later for new listings.</p>
              </div>
            </div>
          ) : (
            listings.map((listing) => {
              const pricingInfo = getPricingDisplay(listing);
              const features = getFeatures(listing);
              
              return (
                <motion.div
                  key={listing._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="bg-card rounded-xl lg:rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 group"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] bg-muted relative">
                      {/* Get image from cover photo or first available image */}
                      {(() => {
                        const imageUrl = listing.coverPhoto || 
                                       (listing.pics && listing.pics.length > 0 ? listing.pics[0] : null) ||
                                       (listing.images && listing.images.length > 0 ? listing.images[0] : null);
                        
                        return imageUrl ? (
                          <PropertyImage 
                            src={imageUrl} 
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                              {listing.type === 'gaming' ? (
                                <Gamepad2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                              ) : listing.type === 'mess' ? (
                                <Utensils className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                              ) : (
                                <Camera className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Badge */}
                    <Badge 
                      className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-primary text-primary-foreground font-semibold text-xs lg:text-sm"
                    >
                      Featured
                    </Badge>

                    {/* Image Gallery Indicators */}
                    {(() => {
                      const totalPhotos = (listing.coverPhoto ? 1 : 0) + 
                                        (listing.facilityPhotos?.length || 0) + 
                                        (listing.pics?.length || 0) +
                                        (listing.images?.length || 0);
                      return totalPhotos > 1 && (
                        <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 right-2 sm:right-3 lg:right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          <span>{totalPhotos} photos</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features - Real amenities with cool colors and icons */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {features.slice(0, 3).map((feature) => (
                        <span
                          key={feature.key}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${feature.badgeColor}`}
                          title={feature.label}
                        >
                          <span className="mr-1">{feature.icon}</span>
                          <span className="hidden sm:inline">{feature.label}</span>
                        </span>
                      ))}
                      {/* Show "+X more" if there are more amenities */}
                      {(() => {
                        const totalAmenities = getListingAmenities(listing.originalData, listing.type).length;
                        const roomTypes = listing.type === 'pg' ? getListingRoomTypes(listing.originalData as Property).length : 0;
                        const totalFeatures = totalAmenities + roomTypes;
                        const showing = 3;
                        
                        return totalFeatures > showing && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{totalFeatures - showing} more
                          </span>
                        );
                      })()}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xl sm:text-2xl font-bold text-primary">
                            ₹{pricingInfo.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {pricingInfo.period}
                        </span>
                        {pricingInfo.subtitle && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {pricingInfo.subtitle}
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm"
                        className="hover-glow text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9"
                        onClick={() => navigate(getNavigationPath(listing))}
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
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
            onClick={() => {
              switch (activeCategory) {
                case 'pg':
                  navigate('/pg-hostels');
                  break;
                case 'mess':
                  navigate('/mess-cafe');
                  break;
                case 'gaming':
                  navigate('/gaming-zone');
                  break;
                default:
                  navigate('/pg-hostels'); // Default to PG listings
              }
            }}
          >
            View All {categories.find(cat => cat.id === activeCategory)?.label || 'Listings'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedListings;