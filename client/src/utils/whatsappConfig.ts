// WhatsApp Configuration
// Update this file with your actual WhatsApp number

export const WHATSAPP_CONFIG = {
  // Your WhatsApp number (include country code without + sign)
  // For +91 8852019731, use '918852019731'
  phoneNumber: '918852019731', // Indian number: +91 8852019731
  
  // Business name for message footer
  businessName: 'LocalSpot Platform'
};

// Function to create WhatsApp message
export const createBookingMessage = (propertyDetails: any, customerDetails: any) => {
  return `🏠 *New PG Booking Request*

📍 *Property Details:*
• Name: ${propertyDetails.title}
• Location: ${propertyDetails.location}
• Price: 💰 ₹${propertyDetails.price.toLocaleString()}/month

👤 *Customer Details:*
• Name: ${customerDetails.name}
• Mobile: ${customerDetails.mobile}
• Email: ${customerDetails.email}
• Room Type: ${customerDetails.roomType || 'Standard Room'}
• Move-in Date: ${customerDetails.moveInDate || 'Not specified'}

💬 *Additional Message:*
${customerDetails.message || 'No additional message'}
`;
};

// Function to create WhatsApp URL
export const createWhatsAppURL = (message: string) => {
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
};
