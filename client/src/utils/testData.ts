// Test Property with all amenities and room types for verification
export const testProperty = {
  _id: "test123",
  title: "Luxury PG with All Amenities",
  description: "Fully equipped property with all modern amenities",
  price: 15000,
  location: "Central Delhi",
  category: "pg" as const,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: "admin123",
  pics: ["https://example.com/test.jpg"],
  amenities: {
    ac: true,
    wifi: true,
    ro: true,
    mess: true,
    securityGuard: true,
    maid: true,
    parking: false,
    laundry: true,
    powerBackup: true,
    cctv: true
  },
  roomTypes: {
    single: true,
    double: true,
    triple: false,
    dormitory: false
  }
};

// Test Property with minimal amenities
export const minimalProperty = {
  _id: "test456",
  title: "Basic PG",
  description: "Simple accommodation",
  price: 8000,
  location: "Outskirts",
  category: "pg" as const,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: "admin123",
  pics: [],
  amenities: {
    ac: false,
    wifi: true,
    ro: false,
    mess: false,
    securityGuard: false,
    maid: false,
    parking: false,
    laundry: false,
    powerBackup: false,
    cctv: false
  },
  roomTypes: {
    single: false,
    double: true,
    triple: false,
    dormitory: false
  }
};
