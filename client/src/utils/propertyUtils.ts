import { Property } from '../types';

// Amenity icons and labels
export const amenityConfig = {
  ac: { label: 'AC', icon: '❄️' },
  wifi: { label: 'WiFi', icon: '📶' },
  ro: { label: 'RO Water', icon: '💧' },
  mess: { label: 'Mess', icon: '🍽️' },
  securityGuard: { label: 'Security', icon: '🛡️' },
  maid: { label: 'Maid', icon: '🧹' },
  parking: { label: 'Parking', icon: '🅿️' },
  laundry: { label: 'Laundry', icon: '👕' },
  powerBackup: { label: 'Power Backup', icon: '🔋' },
  cctv: { label: 'CCTV', icon: '📹' },
};

// Room type icons and labels
export const roomTypeConfig = {
  single: { label: 'Single', icon: '🛏️', description: 'Single occupancy' },
  double: { label: 'Double', icon: '🛏️🛏️', description: 'Double occupancy' },
  triple: { label: 'Triple', icon: '🛏️🛏️🛏️', description: 'Triple occupancy' },
  dormitory: { label: 'Dormitory', icon: '🏠', description: 'Shared accommodation' },
};

// Get available amenities for a property
export const getAvailableAmenities = (property: Property) => {
  if (!property.amenities) return [];
  
  return Object.entries(property.amenities)
    .filter(([_, isAvailable]) => isAvailable)
    .map(([key, _]) => ({
      key,
      ...amenityConfig[key as keyof typeof amenityConfig]
    }));
};

// Get available room types for a property
export const getAvailableRoomTypes = (property: Property) => {
  if (!property.roomTypes) return [];
  
  return Object.entries(property.roomTypes)
    .filter(([_, isAvailable]) => isAvailable)
    .map(([key, _]) => ({
      key,
      ...roomTypeConfig[key as keyof typeof roomTypeConfig]
    }));
};

// Format amenities as text
export const formatAmenitiesText = (property: Property) => {
  const available = getAvailableAmenities(property);
  return available.length > 0 
    ? available.map(a => a.label).join(', ')
    : 'No amenities specified';
};

// Format room types as text
export const formatRoomTypesText = (property: Property) => {
  const available = getAvailableRoomTypes(property);
  return available.length > 0 
    ? available.map(rt => rt.label).join(', ')
    : 'No room types specified';
};
