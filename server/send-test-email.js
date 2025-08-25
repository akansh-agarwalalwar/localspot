const nodemailer = require('nodemailer');

async function sendTestFreelancerEmail() {
  try {
    console.log('🚀 Sending test freelancer registration email...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'helpstudentshub@gmail.com',
        pass: 'vbpa wbrr etyq zzdc'
      }
    });

    const freelancerData = {
      fullName: "Vansh Agarwal (TEST)",
      email: "vansh.test@gmail.com",
      mobile: "+91 9876543210",
      year: "3rd Year", 
      branch: "Computer Science Engineering",
      skills: ["coding", "assignments", "documents"],
      experience: "intermediate",
      hourlyRate: "₹500-800 per project"
    };

    const skillsText = freelancerData.skills.map(skill => {
      const skillLabels = {
        'assignments': 'Assignment Writing',
        'excel': '4th Year Projects',
        'documents': 'Files Writing',
        'coding': 'Programming/Projects',
        'design': 'Graphic Design',
        'research': 'EG Files'
      };
      return skillLabels[skill] || skill;
    }).join(', ');

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .section { background: white; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; }
        .footer { background: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 TEST: New Freelancer Registration</h1>
            <p>StudentsHub Platform</p>
        </div>
        <div class="content">
            <div class="section">
                <h3>👤 Personal Information</h3>
                <p><strong>Full Name:</strong> ${freelancerData.fullName}</p>
                <p><strong>Email:</strong> ${freelancerData.email}</p>
                <p><strong>Mobile:</strong> ${freelancerData.mobile}</p>
            </div>
            <div class="section">
                <h3>🎓 Academic Background</h3>
                <p><strong>Academic Year:</strong> ${freelancerData.year}</p>
                <p><strong>Branch/Field:</strong> ${freelancerData.branch}</p>
            </div>
            <div class="section">
                <h3>💼 Professional Details</h3>
                <p><strong>Skills Offered:</strong> ${skillsText}</p>
                <p><strong>Experience Level:</strong> ${freelancerData.experience}</p>
                <p><strong>Expected Rate:</strong> ${freelancerData.hourlyRate}</p>
            </div>
            <div class="section">
                <h3>✅ Action Required</h3>
                <p>This is a test email to verify the freelancer registration functionality is working.</p>
                <p><strong>Test Time:</strong> ${new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata' 
                })}</p>
            </div>
        </div>
        <div class="footer">
            <p>This TEST email was sent from StudentsHub platform.</p>
            <p>Making student life easier! 🚀</p>
        </div>
    </div>
</body>
</html>`;

    const mailOptions = {
      from: `"${freelancerData.fullName}" <helpstudentshub@gmail.com>`,
      to: 'helpstudentshub@gmail.com',
      replyTo: freelancerData.email,
      subject: `🧪 TEST: Freelancer Registration - ${freelancerData.fullName}`,
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test freelancer email sent successfully!');
    console.log('📧 Email sent to: helpstudentshub@gmail.com');
    console.log('📝 Message ID:', result.messageId);
    console.log('🎯 Check your email inbox for the test registration!');

  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
  }
}

sendTestFreelancerEmail();
