const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create a transporter using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'helpstudentshub@gmail.com', // Your email
      pass: 'vbpa wbrr etyq zzdc' // Your Gmail App Password
    }
  });
};

// Alternative: Use a free SMTP service like Brevo (Sendinblue)
const createBrevoTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-brevo-smtp-key'
    }
  });
};

// Route to send freelancer registration email
router.post('/send-freelancer-email', async (req, res) => {
  try {
    const { fullName, email, mobile, year, branch, skills, experience, hourlyRate } = req.body;

    const skillsText = skills.map(skill => {
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
            <h1>🎉 New Freelancer Registration</h1>
            <p>StudentsHub Platform</p>
        </div>
        <div class="content">
            <div class="section">
                <h3>👤 Personal Information</h3>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
            </div>
            <div class="section">
                <h3>🎓 Academic Background</h3>
                <p><strong>Academic Year:</strong> ${year}</p>
                <p><strong>Branch/Field:</strong> ${branch}</p>
            </div>
            <div class="section">
                <h3>💼 Professional Details</h3>
                <p><strong>Skills Offered:</strong> ${skillsText}</p>
                <p><strong>Experience Level:</strong> ${experience || 'Not specified'}</p>
                <p><strong>Expected Rate:</strong> ${hourlyRate || 'Not specified'}</p>
            </div>
            <div class="section">
                <h3>✅ Action Required</h3>
                <p>Please review this freelancer's application and add them to the active freelancer database.</p>
                <p><strong>Registration Date:</strong> ${new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata' 
                })}</p>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from StudentsHub platform.</p>
            <p>Making student life easier! 🚀</p>
        </div>
    </div>
</body>
</html>`;

    // For now, we'll use a simple approach - log the email and return success
    console.log('📧 FREELANCER REGISTRATION EMAIL:');
    console.log('To: helpstudentshub@gmail.com');
    console.log('From:', fullName, '<' + email + '>');
    console.log('Subject: 🎉 New Freelancer Registration -', fullName);
    console.log('Content:', emailContent);

    // Send success response (after email is sent)
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${fullName}" <helpstudentshub@gmail.com>`,
      to: 'helpstudentshub@gmail.com',
      replyTo: email,
      subject: `🎉 New Freelancer Registration - ${fullName}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Freelancer registration email sent successfully'
    });

  } catch (error) {
    console.error('Error sending freelancer email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Route to send client project email
router.post('/send-client-email', async (req, res) => {
  try {
    const { 
      fullName, email, mobile, projectTitle, projectType, description, 
      deadline, budget, skillsNeeded, urgency 
    } = req.body;

    const skillsText = skillsNeeded.map(skill => {
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

    const projectTypeLabels = {
      'assignment': 'Assignment/Homework',
      'project': 'Final Year Project',
      'research': 'Research Paper',
      'coding': 'Programming Task',
      'design': 'Design Work',
      'presentation': 'Presentation',
      'other': 'Other'
    };

    const urgencyLabels = {
      'low': 'Not Urgent (1+ weeks)',
      'medium': 'Moderate (3-7 days)',
      'high': 'Urgent (1-2 days)',
      'critical': 'Critical (Within 24 hours)'
    };

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .section { background: white; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #22c55e; }
        .urgent { border-left-color: #ef4444; }
        .footer { background: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Project Request</h1>
            <p>StudentsHub Platform</p>
        </div>
        <div class="content">
            <div class="section">
                <h3>👤 Client Information</h3>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
            </div>
            <div class="section ${urgency === 'critical' || urgency === 'high' ? 'urgent' : ''}">
                <h3>📋 Project Details</h3>
                <p><strong>Project Title:</strong> ${projectTitle}</p>
                <p><strong>Project Type:</strong> ${projectTypeLabels[projectType] || projectType || 'Not specified'}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Deadline:</strong> ${deadline ? new Date(deadline).toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata' 
                }) : 'Not specified'}</p>
                <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
                <p><strong>Urgency Level:</strong> ${urgencyLabels[urgency] || urgency || 'Not specified'}</p>
            </div>
            <div class="section">
                <h3>🔧 Skills Required</h3>
                <p>${skillsText}</p>
            </div>
            <div class="section">
                <h3>✅ Action Required</h3>
                <p>Please match this project with suitable freelancers from the database and initiate contact.</p>
                <p><strong>Request Date:</strong> ${new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata' 
                })}</p>
            </div>
            <div class="section">
                <h3>💡 Next Steps</h3>
                <ol>
                    <li>Review project requirements</li>
                    <li>Find matching freelancers</li>
                    <li>Connect client with freelancer(s)</li>
                    <li>Monitor project progress</li>
                </ol>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from StudentsHub platform.</p>
            <p>Connecting talent with opportunities! 🎯</p>
        </div>
    </div>
</body>
</html>`;

    // For now, we'll use a simple approach - log the email and return success
    console.log('📧 CLIENT PROJECT REQUEST EMAIL:');
    console.log('To: helpstudentshub@gmail.com');
    console.log('From:', fullName, '<' + email + '>');
    console.log('Subject: 🚀 New Project Request -', projectTitle);
    console.log('Content:', emailContent);

    // Send success response (after email is sent)
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${fullName}" <helpstudentshub@gmail.com>`,
      to: 'helpstudentshub@gmail.com',
      replyTo: email,
      subject: `🚀 New Project Request - ${projectTitle}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Project request email sent successfully'
    });

  } catch (error) {
    console.error('Error sending client email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

module.exports = router;
