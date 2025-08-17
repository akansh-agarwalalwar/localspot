import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: ["+91 98765 43210", "+91 98765 43211"],
      description: "Call us for immediate assistance",
      available: "24/7"
    },
    {
      icon: Mail,
      title: "Email Support", 
      details: ["support@localspothub.com", "help@localspothub.com"],
      description: "Send us your queries anytime",
      available: "Response within 2 hours"
    },
    {
      icon: MapPin,
      title: "Head Office",
      details: ["123 Tech Park, Koramangala", "Bangalore, Karnataka 560034"],
      description: "Visit us for in-person support",
      available: "Mon-Sat, 9 AM - 6 PM"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      details: ["+91 98765 43210"],
      description: "Quick support via WhatsApp",
      available: "24/7"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
    { day: "Holidays", hours: "Emergency support only" }
  ];

  const faqItems = [
    {
      question: "How do I book a PG or hostel?",
      answer: "Browse our verified listings, select your preferred accommodation, and click 'Book Now' to submit your booking request. Our team will confirm within 2 hours."
    },
    {
      question: "Are all properties verified?",
      answer: "Yes, every property on our platform is personally verified by our team to ensure quality, safety, and authenticity of amenities."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including UPI, debit/credit cards, net banking, and digital wallets for secure transactions."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking according to our cancellation policy. Refer to the terms during booking or contact support for assistance."
    },
    {
      question: "How do I list my property?",
      answer: "Contact our team through the 'List Your Property' option. We'll guide you through the verification process and help you get listed."
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 2 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Have questions? Need help finding the perfect accommodation? 
              Our friendly support team is here to assist you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                24/7 Phone Support
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                2-Hour Email Response
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                WhatsApp Support
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-medium hover:shadow-large transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm text-foreground font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {info.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {info.available}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-0 shadow-large">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking Support</SelectItem>
                          <SelectItem value="property">Property Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Describe your query in detail..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Office Hours */}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-muted-foreground">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Find Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">123 Tech Park, Koramangala</p>
                    <p className="text-sm text-muted-foreground">Bangalore, Karnataka 560034</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full">
                    Get Directions
                  </Button>
                  <Button variant="ghost" className="w-full">
                    View on Google Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-hero bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our platform and services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-medium hover:shadow-large transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-primary">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="border-0 shadow-large bg-gradient-hero text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Emergency Support</h3>
              <p className="text-white/90 mb-6">
                Need immediate assistance? Our emergency support team is available 24/7 for urgent matters.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Phone className="h-4 w-4 mr-2" />
                  Call +91 98765 43210
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;