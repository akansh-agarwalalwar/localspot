const fetch = require('node-fetch');

async function submitFreelancerForm() {
  try {
    console.log('🚀 Submitting freelancer form with dummy data...');
    
    const freelancerData = {
      fullName: "Vansh Agarwal",
      email: "vansh.test@gmail.com", 
      mobile: "+91 9876543210",
      year: "3rd Year",
      branch: "Computer Science Engineering",
      skills: ["coding", "assignments", "documents"],
      experience: "intermediate",
      hourlyRate: "₹500-800 per project"
    };

    const response = await fetch('http://localhost:5004/api/email/send-freelancer-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(freelancerData)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Freelancer registration email sent successfully!');
      console.log('📧 Email sent to: helpstudentshub@gmail.com');
      console.log('📝 Message:', result.message);
      console.log('🎯 Check your email inbox for the registration details!');
    } else {
      console.log('❌ Error:', result.message);
    }

  } catch (error) {
    console.error('❌ Error submitting form:', error.message);
  }
}

async function submitClientForm() {
  try {
    console.log('🚀 Submitting client project form with dummy data...');
    
    const clientData = {
      fullName: "Test Client",
      email: "client.test@gmail.com",
      mobile: "+91 9876543210", 
      projectTitle: "Data Analysis Assignment for Final Year",
      projectType: "assignment",
      description: "Need help with statistical analysis using Python and creating visualizations for my final year project. The dataset contains student performance data and requires correlation analysis, regression modeling, and presentation-ready charts.",
      deadline: "2025-08-30T23:59:59",
      budget: "₹800-1200",
      skillsNeeded: ["coding", "excel", "documents"],
      urgency: "medium"
    };

    const response = await fetch('http://localhost:5004/api/email/send-client-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Client project request email sent successfully!');
      console.log('📧 Email sent to: helpstudentshub@gmail.com');
      console.log('📝 Message:', result.message);
      console.log('🎯 Check your email inbox for the project request details!');
    } else {
      console.log('❌ Error:', result.message);
    }

  } catch (error) {
    console.error('❌ Error submitting form:', error.message);
  }
}

// Run both tests
async function runTests() {
  console.log('🧪 Testing StudentsHub Email Functionality\n');
  
  await submitFreelancerForm();
  console.log('\n' + '='.repeat(50) + '\n');
  await submitClientForm();
  
  console.log('\n🎉 Email tests completed!');
  console.log('📧 Check helpstudentshub@gmail.com for both test emails.');
}

runTests();
