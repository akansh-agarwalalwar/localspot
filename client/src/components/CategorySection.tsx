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
    <section className="py-20 bg-muted/30">
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
            Explore Our{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect accommodation, food, and entertainment options tailored to your needs
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                className="category-card bg-card rounded-2xl p-8 shadow-medium hover:shadow-large group cursor-pointer"
              >
                {/* Icon & Gradient Background */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                    {category.listings}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {category.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-hover transition-all duration-300"
                  variant="outline"
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
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
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
                className="bg-card rounded-xl p-6 shadow-soft"
              >
                <StatIcon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
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