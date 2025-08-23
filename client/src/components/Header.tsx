import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, Phone, Menu, X, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "PG / Hostels", href: "/pg-hostels" },
    { label: "Mess / Cafe", href: "/mess-cafe" },
    { label: "Gaming Zone", href: "/gaming-zone" },
    { label: "Paid GIG", href: "/paid-gig", isNew: true },
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
            <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">PgNearU</span>
            <span className="hidden md:inline text-primary-foreground/90">Find best room online at a single place</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-hover"
            >
              <Phone className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">+91 88520 19731</span>
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
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center w-fit h-fit overflow-hidden cursor-pointer"
              onClick={() => {
                navigate('/');
                window.scrollTo(0, 0);
              }}
            >
              <img 
                src="/logo.png" 
                alt="PgNearU Logo" 
                className="h-12 w-auto object-contain"
              />
            </motion.div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center gap-2 bg-muted rounded-full px-4 py-2 flex-1 max-w-md mx-8">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, category..."
                className="border-0 bg-transparent text-black placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                >
                  {item.label === "Paid GIG" ? (
                    <Link
                      to={item.href}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      <span className="bg-yellow-400 text-purple-800 text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
                    </Link>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-foreground hover:text-primary transition-colors duration-300 relative group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  )}
                </motion.div>
              ))}
              {/* Login/Signup Button */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 + navItems.length * 0.1 }}
              >
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                >
                  Login / Signup
                </Button>
              </motion.div>
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
                className="border-0 bg-transparent text-black placeholder:text-muted-foreground focus-visible:ring-0"
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
                <motion.div
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: isMenuOpen ? 0 : -20, opacity: isMenuOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.label === "Paid GIG" ? (
                    <Link
                      to={item.href}
                      className="flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      <span className="bg-yellow-400 text-purple-800 text-xs px-2 py-0.5 rounded-full font-bold ml-auto">NEW</span>
                    </Link>
                  ) : (
                    <Link
                      to={item.href}
                      className="block py-2 px-4 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              {/* Mobile Login/Signup Button */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: isMenuOpen ? 0 : -20, opacity: isMenuOpen ? 1 : 0 }}
                transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                className="pt-2"
              >
                <Button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-all duration-300"
                >
                  Login / Signup
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Header;