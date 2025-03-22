
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="h-8 w-8 rounded-full bg-farm-green-500"></span>
              <span className="font-display text-xl font-bold text-farm-green-800">FarmChain</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Connecting farmers and consumers through blockchain technology for transparent, 
              efficient, and sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-farm-green-600"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-farm-green-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-farm-green-600"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-farm-green-600">Home</Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-600 hover:text-farm-green-600">Marketplace</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-farm-green-600">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-farm-green-600">Contact</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-farm-green-600">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-farm-green-600">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-farm-green-600">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-farm-green-600">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-farm-green-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-farm-green-600">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-farm-green-500 mt-0.5" />
                <span className="text-gray-600">
                  123 Farm Lane<br />
                  Green Valley, CA 94534
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-farm-green-500" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-farm-green-500" />
                <span className="text-gray-600">support@farmchain.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>© 2023 FarmChain Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
