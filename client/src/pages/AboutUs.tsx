import { motion } from "framer-motion";
import { Target, Users, Shield, Award, TrendingUp, Heart, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const stats = [
    { label: "Happy Customers", value: "5000+", icon: Users },
    { label: "Verified Properties", value: "1000+", icon: Shield },
    { label: "Cities Covered", value: "25+", icon: TrendingUp },
    { label: "Success Rate", value: "95%", icon: Award },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To simplify local accommodation and service booking by connecting people with quality, verified options that match their needs and budget."
    },
    {
      icon: Heart,
      title: "Our Vision", 
      description: "To become India's most trusted platform for local services, making quality accommodation and experiences accessible to everyone."
    },
    {
      icon: Shield,
      title: "Our Values",
      description: "Transparency, reliability, and customer satisfaction drive everything we do. We believe in building trust through verified listings and honest reviews."
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Verified Listings",
      description: "Every property and service is personally verified by our team to ensure quality and authenticity."
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book accommodations and services instantly with our streamlined booking process."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Your transactions are protected with industry-standard security measures."
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to assist you."
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      description: "10+ years in hospitality and tech. Passionate about solving accommodation challenges for students and professionals.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Priya Sharma", 
      role: "Head of Operations",
      description: "Expert in scaling service platforms. Ensures quality and consistency across all our partner properties.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Arjun Reddy",
      role: "Head of Technology", 
      description: "Building robust, user-friendly platforms. Focuses on making booking experiences seamless and secure.",
      image: "/api/placeholder/150/150"
    }
  ];

  const journey = [
    {
      year: "2021",
      title: "The Beginning",
      description: "Started with a vision to solve accommodation challenges in Bangalore"
    },
    {
      year: "2022", 
      title: "First 100 Properties",
      description: "Onboarded verified PGs and hostels across major tech hubs"
    },
    {
      year: "2023",
      title: "Expansion", 
      description: "Added mess services, cafes, and gaming zones to our platform"
    },
    {
      year: "2024",
      title: "25 Cities",
      description: "Expanded to 25+ cities with 1000+ verified properties and services"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg">
              About LocalSpot Hub
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              We're on a mission to make finding quality local accommodations and services as easy as clicking a button. 
              Connecting people with verified, affordable options across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                Founded in 2021
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                5000+ Happy Customers
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                25+ Cities
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="border-0 shadow-medium hover:shadow-large transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mission, Vision, Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="bg-gradient-hero bg-clip-text text-transparent">Purpose</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding what drives us and the impact we aim to create
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <Card className="h-full border-0 shadow-medium hover:shadow-large transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* How We Work */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              How LocalSpot Hub <span className="bg-gradient-hero bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the entire process from search to booking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Our Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="bg-gradient-hero bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a simple idea to a trusted platform serving thousands
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-hero rounded-full"></div>
            <div className="space-y-12">
              {journey.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="border-0 shadow-medium">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-8 h-8 bg-gradient-primary rounded-full border-4 border-background shadow-medium z-10"></div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Meet Our <span className="bg-gradient-hero bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals working to make your accommodation search effortless
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-medium hover:shadow-large transition-all duration-300 text-center">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="border-0 shadow-large bg-gradient-hero text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Perfect Space?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their ideal accommodation through LocalSpot Hub
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Start Your Search
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  List Your Property
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

export default AboutUs;