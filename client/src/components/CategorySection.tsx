import { motion } from "framer-motion";
import { ChefHat, Joystick, Building, Wifi, Car, Shield, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "rooms-flats",
      title: "Rooms & Flats",
      description: "Private spaces for individuals and families",
      icon: Building,
      features: ["Wifi Included", "Mess Available", "24/7 Security", "Cleaning Service"],
      gradient: "from-primary to-accent",
      listings: "New",
      route: "/pg-hostels",
    },
    {
      id: "mess-cafe",
      title: "Mess & Cafes",
      description: "Home-style meals and cozy workspaces",
      icon: ChefHat,
      features: ["Daily Menus", "Flexible Plans", "Fresh Food", "AC Available"],
      gradient: "from-secondary to-secondary-hover",
      listings: "Popular",
      route: "/mess-cafe",
    },
    {
      id: "gaming-zone",
      title: "Gaming Zones",
      description: "Entertainment and gaming facilities",
      icon: Joystick,
      features: ["Latest Games", "Hourly Rates", "Tournaments", "Group Booking"],
      gradient: "from-accent to-accent-hover",
      listings: "Featured",
      route: "/gaming-zone",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4">
            Explore Our{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Find the perfect accommodation, food, and entertainment options tailored to your needs
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="category-card bg-card rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-medium hover:shadow-large group cursor-pointer"
              >
                {/* Icon & Gradient Background */}
                <div className="relative mb-4 lg:mb-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${category.gradient} rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                    {category.listings}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold mb-2 lg:mb-3 group-hover:text-primary transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4 lg:mb-6 text-xs sm:text-sm leading-relaxed">
                  {category.description}
                </p>

                {/* Features */}
                <div className="space-y-1 lg:space-y-2 mb-4 lg:mb-6">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
                  onClick={() => {
                    navigate(category.route);
                    window.scrollTo(0, 0);
                  }}
                >
                  Explore Now
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center"
        >
          {[
            { label: "Quality Verified", value: "100%", icon: Building2 },
            { label: "Customer First", value: "Always", icon: Shield },
            { label: "Local Focus", value: "DTU Area", icon: Car },
            { label: "Support", value: "24/7", icon: Clock },
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 shadow-soft"
              >
                <StatIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary mx-auto mb-2 lg:mb-3" />
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;