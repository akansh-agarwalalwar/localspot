import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "PG & Hostels", href: "#pg-hostels" },
        { label: "Mess & Cafes", href: "#mess-cafe" },
        { label: "Gaming Zones", href: "#gaming-zone" },
        { label: "Rooms & Flats", href: "#rooms-flats" },
        { label: "About Us", href: "#about" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Contact Us", href: "#contact" },
        { label: "FAQ", href: "#faq" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Privacy Policy", href: "#privacy" },
      ],
    },
    {
      title: "For Owners",
      links: [
        { label: "List Your Property", href: "#list-property" },
        { label: "Owner Portal", href: "#owner-portal" },
        { label: "Pricing Plans", href: "#pricing" },
        { label: "Success Stories", href: "#success" },
        { label: "Resources", href: "#resources" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
    },
    {
      icon: Mail,
      label: "Email",
      value: "support@localspothub.com",
      href: "mailto:support@localspothub.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Tech Park, Bangalore, Karnataka 560001",
      href: "#",
    },
  ];

  return (
    <footer className="bg-muted/30 pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">LS</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                LocalSpot Hub
              </span>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted platform for finding the perfect accommodation, food, and entertainment options. 
              Connecting people with quality local services across India.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <motion.a
                    key={index}
                    href={contact.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                  >
                    <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <Icon className="h-4 w-4 text-primary group-hover:text-white" />
                    </div>
                    <span className="text-sm">{contact.value}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + sectionIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: linkIndex * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm relative group"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card rounded-2xl p-8 mb-12 shadow-medium"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                Stay Updated with{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  LocalSpot Hub
                </span>
              </h3>
              <p className="text-muted-foreground">
                Get the latest listings, special offers, and platform updates delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter your email address"
                className="flex-1"
              />
              <Button className="bg-gradient-primary hover:opacity-90 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © 2024 LocalSpot Hub. All rights reserved. Made with ❤️ in India
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground mr-3">Follow us:</span>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 pt-6 border-t border-muted/50"
        >
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="text-xs text-muted-foreground">
              🏠 Verified Properties
            </div>
            <div className="text-xs text-muted-foreground">
              🔒 Secure Booking
            </div>
            <div className="text-xs text-muted-foreground">
              📞 24/7 Support
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;