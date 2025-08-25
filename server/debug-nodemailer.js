const nodemailer = require('nodemailer');

console.log('Nodemailer object:');
console.log(Object.getOwnPropertyNames(nodemailer));
console.log('Type of createTransporter:', typeof nodemailer.createTransporter);

// Try the correct method
try {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'test@gmail.com',
      pass: 'test'
    }
  });
  console.log('✅ createTransporter works!');
} catch (error) {
  console.log('❌ createTransporter failed:', error.message);
}
