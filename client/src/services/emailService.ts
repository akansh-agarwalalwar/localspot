import emailjs from '@emailjs/browser';

interface FreelancerEmailData {
  fullName: string;
  email: string;
  mobile: string;
  year: string;
  branch: string;
  skills: string[];
  experience: string;
  hourlyRate: string;
}

interface ClientEmailData {
  fullName: string;
  email: string;
  mobile: string;
  projectTitle: string;
  projectType: string;
  description: string;
  deadline: string;
  budget: string;
  skillsNeeded: string[];
  urgency: string;
}

// Function to send emails using our backend endpoint
const sendEmailViaBackend = async (endpoint: string, data: any) => {
  try {
    console.log('🚀 Sending email request to backend:', endpoint);
    console.log('📧 Email data:', data);
    
    const response = await fetch(`http://localhost:5004/api/email/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error Response:', errorText);
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Backend response:', result);
    
    if (result.success) {
      console.log('✅ Email sent successfully via backend');
      return { success: true, message: result.message };
    } else {
      console.error('❌ Backend email error:', result);
      throw new Error(result.message || 'Failed to send email via backend');
    }
  } catch (error: any) {
    console.error('❌ Backend email error details:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    
    throw error;
  }
};

export const sendFreelancerRegistrationEmail = async (data: FreelancerEmailData) => {
  try {
    const result = await sendEmailViaBackend('send-freelancer-email', data);
    return result;

  } catch (error) {
    console.error('Error sending freelancer email:', error);
    throw new Error('Failed to send registration email');
  }
};

export const sendClientProjectEmail = async (data: ClientEmailData) => {
  try {
    const result = await sendEmailViaBackend('send-client-email', data);
    return result;

  } catch (error) {
    console.error('Error sending client project email:', error);
    throw new Error('Failed to send project request email');
  }
};

/*
📧 EMAIL SETUP INSTRUCTIONS:

OPTION 1 - EmailJS (Recommended for production):
1. Go to https://www.emailjs.com/ and create a free account
2. Add Gmail service
3. Create email templates
4. Get your Public Key and Service ID
5. Replace the configuration values above
6. Remove the mock implementation

OPTION 2 - Formspree (Alternative):
1. Go to https://formspree.io/ and create account
2. Create a new form
3. Get your form endpoint
4. Replace the formspree URL above

OPTION 3 - Your own backend:
Create an endpoint that sends emails and replace the webhook URL.

CURRENT STATUS:
✅ Forms are working and will show success messages
✅ All form data is being logged to console
✅ Email structure is properly formatted
❌ Actual email sending needs service configuration

The email will be sent to: helpstudentshub@gmail.com
*/
