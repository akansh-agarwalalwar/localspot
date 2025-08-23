import { Property, Mess, GamingZone } from '../types';
import { amenityConfig, roomTypeConfig } from './propertyUtils';

// Mess specific amenity configuration
export const messAmenityConfig = {
  ac: { label: 'AC', icon: '❄️' },
  wifi: { label: 'WiFi', icon: '📶' },
  ro: { label: 'RO Water', icon: '💧' },
  dailyMeals: { label: 'Daily Meals', icon: '🍽️' },
  hygienic: { label: 'Hygienic', icon: '🧼' },
  freshFood: { label: 'Fresh Food', icon: '🥗' },
  parking: { label: 'Parking', icon: '🅿️' },
  cctv: { label: 'CCTV', icon: '📹' },
  powerBackup: { label: 'Power Backup', icon: '🔋' },
  securityGuard: { label: 'Security', icon: '🛡️' },
};

// Gaming zone specific amenity configuration
export const gamingAmenityConfig = {
  ac: { label: 'AC', icon: '❄️' },
  wifi: { label: 'WiFi', icon: '📶' },
  gamingConsole: { label: 'Gaming Console', icon: '🎮' },
  ps5: { label: 'PlayStation 5', icon: '🎯' },
  xbox: { label: 'Xbox', icon: '🎲' },
  parking: { label: 'Parking', icon: '🅿️' },
  powerBackup: { label: 'Power Backup', icon: '🔋' },
  cctv: { label: 'CCTV Security', icon: '📹' },
  refreshments: { label: 'Refreshments', icon: '🥤' },
  tournaments: { label: 'Tournaments', icon: '🏆' },
};

// Get available amenities for any listing type
export const getListingAmenities = (listing: Property | Mess | GamingZone, type: 'pg' | 'mess' | 'gaming') => {
  let amenities: { key: string; label: string; icon: string }[] = [];
  
  if (type === 'mess') {
    const mess = listing as Mess;
    const messAmenities = [];
    
    // For mess, we need to check individual properties since it doesn't have an amenities object
    if (mess.hasAC) {
      messAmenities.push({ key: 'ac', label: 'AC', icon: '❄️' });
    }
    
    // Add some default mess amenities based on timings
    if (mess.timings?.breakfast?.available) {
      messAmenities.push({ key: 'breakfast', label: 'Breakfast', icon: '🌅' });
    }
    if (mess.timings?.lunch?.available) {
      messAmenities.push({ key: 'lunch', label: 'Lunch', icon: '🌞' });
    }
    if (mess.timings?.dinner?.available) {
      messAmenities.push({ key: 'dinner', label: 'Dinner', icon: '🌙' });
    }
    if (mess.timings?.snacks?.available) {
      messAmenities.push({ key: 'snacks', label: 'Snacks', icon: '🍿' });
    }
    
    // Add some default mess features
    messAmenities.push(
      { key: 'hygienic', label: 'Hygienic', icon: '🧼' },
      { key: 'freshFood', label: 'Fresh Food', icon: '🥗' }
    );
    
    amenities = messAmenities;
  } else if (type === 'gaming') {
    const gaming = listing as GamingZone;
    if (gaming.amenities) {
      amenities = Object.entries(gaming.amenities)
        .filter(([_, isAvailable]) => isAvailable)
        .map(([key, _]) => ({
          key,
          ...gamingAmenityConfig[key as keyof typeof gamingAmenityConfig],
          label: gamingAmenityConfig[key as keyof typeof gamingAmenityConfig]?.label || key,
          icon: gamingAmenityConfig[key as keyof typeof gamingAmenityConfig]?.icon || '✓'
        }));
    }
  } else {
    // For PG properties
    const property = listing as Property;
    if (property.amenities) {
      amenities = Object.entries(property.amenities)
        .filter(([_, isAvailable]) => isAvailable)
        .map(([key, _]) => ({
          key,
          ...amenityConfig[key as keyof typeof amenityConfig],
          label: amenityConfig[key as keyof typeof amenityConfig]?.label || key,
          icon: amenityConfig[key as keyof typeof amenityConfig]?.icon || '✓'
        }));
    }
  }
  
  return amenities;
};

// Get available room types for PG properties
export const getListingRoomTypes = (property: Property) => {
  if (!property.roomTypes) return [];
  
  return Object.entries(property.roomTypes)
    .filter(([_, isAvailable]) => isAvailable)
    .map(([key, _]) => ({
      key,
      ...roomTypeConfig[key as keyof typeof roomTypeConfig]
    }));
};

// Get amenity badge colors based on type
export const getAmenityBadgeColor = (type: 'pg' | 'mess' | 'gaming') => {
  switch (type) {
    case 'pg':
      return 'bg-blue-100 text-blue-800';
    case 'mess':
      return 'bg-green-100 text-green-800';
    case 'gaming':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get room type badge color
export const getRoomTypeBadgeColor = () => {
  return 'bg-indigo-100 text-indigo-800';
};
