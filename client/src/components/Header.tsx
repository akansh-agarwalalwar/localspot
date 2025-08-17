import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "PG / Hostels", href: "/pg-hostels" },
    { label: "Mess / Cafe", href: "/mess-cafe" },
    { label: "Gaming Zone", href: "/gaming-zone" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Info Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-primary text-primary-foreground py-2 px-4"
      >
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold">LocalSpot Hub</span>
            <span className="hidden md:inline">Your Local Booking Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-hover"
            >
              <Phone className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">+91 98765 43210</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-hover"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-effect border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                LocalSpot
              </span>
            </motion.div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center gap-2 bg-muted rounded-full px-4 py-2 flex-1 max-w-md mx-8">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, category..."
                className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className="text-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Search Bar */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isMenuOpen ? "auto" : 0, opacity: isMenuOpen ? 1 : 0 }}
            className="md:hidden mt-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, category..."
                className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </motion.div>

          {/* Mobile Navigation Menu */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isMenuOpen ? "auto" : 0, opacity: isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: isMenuOpen ? 0 : -20, opacity: isMenuOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="block py-2 px-4 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Header;