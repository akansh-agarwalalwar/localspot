const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'helpstudentshub@gmail.com',
        pass: 'vbpa wbrr etyq zzdc' // Gmail App Password
      }
    });
    
    console.log('Transporter created successfully');
    
    const mailOptions = {
      from: '"Test User" <helpstudentshub@gmail.com>',
      to: 'helpstudentshub@gmail.com',
      subject: '🧪 Email Test - StudentsHub Platform',
      html: `
        <h2>✅ Email Test Successful!</h2>
        <p>This is a test email from the StudentsHub platform.</p>
        <p>The freelancer form email functionality is working correctly.</p>
        <p><strong>Test Data:</strong></p>
        <ul>
          <li>Full Name: Test User</li>
          <li>Email: test@example.com</li>
          <li>Skills: Programming, Assignment Writing</li>
          <li>Year: 3rd Year</li>
          <li>Branch: Computer Science</li>
        </ul>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    };

    console.log('Sending email...');
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
