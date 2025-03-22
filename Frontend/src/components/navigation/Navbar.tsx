import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useMarketplace();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    return user.userType === "farmer" ? "/farmer/dashboard" : "/consumer/dashboard";
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-full bg-farm-green-500"></span>
            <span className="font-display text-xl font-bold text-farm-green-800">FarmChain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-farm-green-600 font-medium">
              Home
            </Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-farm-green-600 font-medium">
              Marketplace
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-farm-green-600 font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-farm-green-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* Search, Cart, and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
            </form>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-farm-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link 
                      to={getDashboardLink()} 
                      className="flex items-center w-full"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link 
                      to={`${getDashboardLink()}?tab=profile`} 
                      className="flex items-center w-full"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
            </form>
            
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-farm-green-600 font-medium">
                Home
              </Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-farm-green-600 font-medium">
                Marketplace
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-farm-green-600 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-farm-green-600 font-medium">
                Contact
              </Link>
              <div className="flex justify-between items-center">
                <Link to="/cart" className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  <span>Cart ({totalCartItems})</span>
                </Link>
                {isAuthenticated ? (
                  <Link to={getDashboardLink()} className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-700" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
