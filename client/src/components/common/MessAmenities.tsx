import React from 'react';
import { Mess } from '../../types';

interface MessAmenitiesProps {
  mess: Mess;
  compact?: boolean;
  className?: string;
}

const MessAmenities: React.FC<MessAmenitiesProps> = ({ mess, compact = false, className = '' }) => {
  const getAvailableMeals = () => {
    const available = [];
    if (mess.timings.breakfast.available) available.push({ name: 'Breakfast', time: mess.timings.breakfast.time });
    if (mess.timings.lunch.available) available.push({ name: 'Lunch', time: mess.timings.lunch.time });
    if (mess.timings.dinner.available) available.push({ name: 'Dinner', time: mess.timings.dinner.time });
    if (mess.timings.snacks.available) available.push({ name: 'Snacks', time: mess.timings.snacks.time });
    return available;
  };

  const availableMeals = getAvailableMeals();

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {mess.hasAC && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ❄️ AC
          </span>
        )}
        {availableMeals.slice(0, 3).map((meal) => (
          <span 
            key={meal.name}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            {meal.name === 'Breakfast' ? '🍳' : 
             meal.name === 'Lunch' ? '🍽️' : 
             meal.name === 'Dinner' ? '🌙' : '🍿'} {meal.name}
          </span>
        ))}
        {availableMeals.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            +{availableMeals.length - 3} more
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* AC Status */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Facilities</h4>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            mess.hasAC 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            ❄️ {mess.hasAC ? 'Air Conditioned' : 'Non-AC'}
          </span>
        </div>
      </div>

      {/* Available Meals */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Meals</h4>
        {availableMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableMeals.map((meal) => (
              <div 
                key={meal.name}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">
                    {meal.name === 'Breakfast' ? '🍳' : 
                     meal.name === 'Lunch' ? '🍽️' : 
                     meal.name === 'Dinner' ? '🌙' : '🍿'}
                  </span>
                  <span className="font-medium text-gray-900">{meal.name}</span>
                </div>
                {meal.time && (
                  <span className="text-sm text-gray-600">{meal.time}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No meal timings specified</p>
        )}
      </div>

      {/* Distance */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Location</h4>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {mess.distanceFromDTU} from DTU
        </div>
      </div>
    </div>
  );
};

export default MessAmenities;
