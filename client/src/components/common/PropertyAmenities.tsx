import React from 'react';
import { Property } from '../../types';
import { getAvailableAmenities, getAvailableRoomTypes } from '../../utils/propertyUtils';

interface PropertyAmenitiesProps {
  property: Property;
  showRoomTypes?: boolean;
  compact?: boolean;
  className?: string;
}

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ 
  property, 
  showRoomTypes = true, 
  compact = false,
  className = '' 
}) => {
  const amenities = getAvailableAmenities(property);
  const roomTypes = getAvailableRoomTypes(property);

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 4).map((amenity) => (
              <span 
                key={amenity.key}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                title={amenity.label}
              >
                <span className="mr-1">{amenity.icon}</span>
                {amenity.label}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {showRoomTypes && roomTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {roomTypes.map((roomType) => (
              <span 
                key={roomType.key}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                title={roomType.description}
              >
                <span className="mr-1">{roomType.icon}</span>
                {roomType.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {amenities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {amenities.map((amenity) => (
              <div 
                key={amenity.key}
                className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200"
              >
                <span className="text-lg mr-2">{amenity.icon}</span>
                <span className="text-sm font-medium text-green-800">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showRoomTypes && roomTypes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Room Types</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {roomTypes.map((roomType) => (
              <div 
                key={roomType.key}
                className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                title={roomType.description}
              >
                <span className="text-2xl mb-1">{roomType.icon}</span>
                <span className="text-sm font-medium text-blue-800">{roomType.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {amenities.length === 0 && roomTypes.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No amenities or room types specified</p>
        </div>
      )}
    </div>
  );
};

export default PropertyAmenities;
