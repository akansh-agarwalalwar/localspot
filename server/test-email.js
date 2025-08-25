const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'helpstudentshub@gmail.com',
      pass: 'vbpa wbrr etyq zzdc' // Gmail App Password
    }
  });
};

async function testEmail() {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"Test User" <helpstudentshub@gmail.com>',
      to: 'helpstudentshub@gmail.com',
      subject: '🧪 Email Test - StudentsHub',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from the StudentsHub platform.</p>
        <p>If you receive this, the email service is working correctly.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Check your email and app password.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Network error. Check your internet connection.');
    }
  }
}

testEmail();
