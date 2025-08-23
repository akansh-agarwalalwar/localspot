import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Users, Shield, Award, TrendingUp, Heart, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Ensure page starts from top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const stats = [
    { label: "Student Focused", value: "100%", icon: Users },
    { label: "Quality Assured", value: "Always", icon: Shield },
    { label: "Local Coverage", value: "DTU Area", icon: TrendingUp },
    { label: "Launch Year", value: "2025", icon: Award },
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
      icon: Users,
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to assist you."
    }
  ];

  const team = [
    {
      name: "Vansh Agarwal",
      role: "Founder & CEO",
      description: "Visionary entrepreneur driving innovation in student accommodation. Passionate about creating seamless experiences that connect students with their perfect living spaces.",
      image: "/vansh.jpeg"
    },
    {
      name: "Swayam Sharma", 
      role: "Head of Operations",
      description: "Operations mastermind ensuring excellence at every touchpoint. Specializes in scaling platforms while maintaining the highest quality standards.",
      image: "/swayam.jpeg"
    },
    {
      name: "Sonu Kumar",
      role: "Head of Technology", 
      description: "Tech architect building the future of property discovery. Creates robust, intuitive platforms that make finding accommodation effortless and secure.",
      image: "/sonu.jpeg"
    }
  ];

  const journey = [
    {
      year: "2025",
      title: "The Idea",
      description: "Identified the need for a trusted platform connecting students with quality local accommodations and services"
    },
    {
      year: "2025", 
      title: "Foundation Built",
      description: "Developed the platform, established partnerships with verified properties around DTU area"
    },
    {
      year: "2025",
      title: "Platform Launch", 
      description: "Officially launched PgNearU with curated listings for PGs, mess services, and gaming zones"
    },
    {
      year: "2025",
      title: "Growing Community",
      description: "Building our user base and expanding our network of trusted property partners"
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
              About PgNearU
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              We're on a mission to make finding quality local accommodations and services as easy as clicking a button. 
              Connecting people with verified, affordable options across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                Founded in 2025
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                Happy Customers
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                Expanding in Cities
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
              How PgNearU <span className="bg-gradient-hero bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the entire process from search to booking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
          ref={timelineRef}
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
            {/* Background Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-muted rounded-full"></div>
            
            {/* Animated Timeline Line that grows with scroll */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-hero rounded-full origin-top"
              style={{ height: lineHeight }}
            ></motion.div>
            
            <div className="space-y-12">
              {journey.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1 + 0.2,
                        ease: "backOut"
                      }}
                    >
                      <Card className="border-0 shadow-medium hover:shadow-large transition-all duration-300">
                        <CardContent className="p-6">
                          <motion.div 
                            className="text-2xl font-bold text-primary mb-2"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.1 + 0.3,
                              type: "spring",
                              stiffness: 200
                            }}
                          >
                            {milestone.year}
                          </motion.div>
                          <h3 className="text-lg font-semibold mb-2">
                            {milestone.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  
                  {/* Animated Timeline Dot */}
                  <motion.div 
                    className="w-8 h-8 bg-gradient-primary rounded-full border-4 border-background shadow-medium z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1 + 0.1,
                      type: "spring",
                      stiffness: 300
                    }}
                    whileHover={{ scale: 1.2 }}
                  ></motion.div>
                  
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
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="bg-gradient-hero bg-clip-text text-transparent">Dream Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The passionate minds behind LocalSpot, working tirelessly to revolutionize how students find their perfect accommodation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-0 shadow-medium hover:shadow-xl transition-all duration-300 text-center group h-full">
                  <CardContent className="p-8">
                    <div className="w-36 h-36 rounded-full mx-auto mb-6 overflow-hidden border-4 border-primary/20 shadow-xl group-hover:border-primary/40 transition-all duration-300 bg-gradient-to-br from-primary/5 to-secondary/5">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                        style={{
                          objectPosition: 'center center',
                          filter: 'brightness(1.05) contrast(1.1) saturate(1.1)'
                        }}
                        onError={(e) => {
                          // Fallback to gradient circle with initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      {/* Fallback gradient circle (hidden by default) */}
                      <div 
                        className="w-36 h-36 bg-gradient-primary rounded-full flex items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        <span className="text-3xl font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                    <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/30 font-semibold">{member.role}</Badge>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
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
                Join thousands of satisfied customers who found their ideal accommodation through PgNearU
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate('/')}
                >
                  Start Your Search
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate('/pg-hostels')}
                >
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