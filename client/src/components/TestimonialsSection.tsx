import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Software Engineer",
      location: "Delhi",
      rating: 5,
      text: "Found the perfect PG through StudentsHub! The booking process was seamless and the amenities were exactly as described. Highly recommended for anyone looking for quality accommodation.",
      avatar: "/api/placeholder/60/60",
      category: "PG Booking",
    },
    {
      id: 2,
      name: "Rahul Kumar",
      role: "Student",
      location: "Pune",
      rating: 5,
      text: "The mess service I booked has been amazing! Home-style food at affordable prices. The platform made it so easy to compare different options and choose the best one.",
      avatar: "/api/placeholder/60/60",
      category: "Mess Service",
    },
    {
      id: 3,
      name: "Anita Desai",
      role: "Marketing Manager",
      location: "Hyderabad",
      rating: 5,
      text: "Great platform for finding gaming zones! Booked multiple sessions for our team events. The variety of options and transparent pricing made the decision easy.",
      avatar: "/api/placeholder/60/60",
      category: "Gaming Zone",
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "Freelancer",
      location: "Chennai",
      rating: 5,
      text: "StudentsHub is a game-changer! Found a cozy cafe with great WiFi for my work sessions. The platform's search filters helped me find exactly what I needed.",
      avatar: "/api/placeholder/60/60",
      category: "Cafe Booking",
    },
    {
      id: 5,
      name: "Sneha Patel",
      role: "Data Analyst",
      location: "Mumbai",
      rating: 4,
      text: "Excellent service and support. The team was very helpful throughout the booking process. Found a great flat that matched all my requirements perfectly.",
      avatar: "/api/placeholder/60/60",
      category: "Room Rental",
    },
    {
      id: 6,
      name: "Arjun Reddy",
      role: "Startup Founder",
      location: "Delhi",
      rating: 5,
      text: "As a startup founder, I appreciate efficiency. StudentsHub delivered exactly that - quick, reliable bookings with verified listings. Will definitely use again!",
      avatar: "/api/placeholder/60/60",
      category: "Co-working Space",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-light via-background to-secondary-light">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real experiences from real customers who found their perfect match through StudentsHub
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all duration-300 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                <Quote className="h-8 w-8 text-primary" />
              </div>

              {/* Category Badge */}
              <div className="inline-block bg-primary-light text-primary text-xs px-3 py-1 rounded-full font-semibold mb-4">
                {testimonial.category}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Decorative Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-hero rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-card rounded-2xl p-8 shadow-medium">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Quality Focus", value: "100%", color: "text-primary" },
                { label: "Launch Ready", value: "2025", color: "text-secondary" },
                { label: "Local Expertise", value: "DTU", color: "text-accent" },
                { label: "Student Focused", value: "Always", color: "text-success" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;