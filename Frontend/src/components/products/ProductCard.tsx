import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Clock, ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMarketplace } from "@/context/MarketplaceContext";
import { AnimatedButton } from "@/components/ui/animated-button";
import { cn } from "@/lib/utils";
import TiltCard from "@/components/ui/tilt-card";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  farmerId: string;
  farmerName: string;
  category: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  organic: boolean;
  bidding: boolean;
  currentBid?: number;
  endBidTime?: string;
  startingBid?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useMarketplace();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    addToCart(product, 1);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Format price or bid
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Calculate time left for bidding
  const getTimeLeft = () => {
    if (!product.endBidTime) return "";
    
    const endTime = new Date(product.endBidTime).getTime();
    const now = new Date().getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return "Auction ended";
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours} hours left`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days left`;
    }
  };

  // Get product price or current bid
  const getPrice = () => {
    if (product.bidding) {
      return formatPrice(product.currentBid || product.startingBid || product.price);
    } else {
      return formatPrice(product.price);
    }
  };

  return (
    <TiltCard 
      className={cn(
        "relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-fade-in-up",
        isHovered ? "z-10" : "z-0"
      )}
      tiltMaxAngle={5}
      glareMaxOpacity={0.2}
      perspective={1500}
      gyroscope={true}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="absolute top-2 right-2 z-20 flex space-x-2">
            <button 
              onClick={toggleFavorite}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all",
                isFavorite ? "text-red-500" : "text-gray-400"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn(
                "h-5 w-5",
                isFavorite && "animate-heartbeat fill-current"
              )} />
            </button>
          </div>
          
          <div className="relative h-48 overflow-hidden group">
            <img 
              src={product.images[0] || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
            />
            
            {product.organic && (
              <Badge className="absolute top-2 left-2 bg-farm-green-500 animate-fade-in z-10 shimmer">
                <Leaf className="h-3 w-3 mr-1 animate-pulse-subtle" /> Organic
              </Badge>
            )}
            
            {product.bidding && (
              <Badge className="absolute bottom-2 left-2 bg-harvest-gold-500 animate-fade-in z-10 shimmer">
                <Clock className="h-3 w-3 mr-1 animate-pulse-subtle" /> {getTimeLeft()}
              </Badge>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="p-4 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-farm-green-700 transition-colors duration-300">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.farmerName}</p>
                <Badge variant="outline" className="text-xs mt-2">
                  {product.category}
                </Badge>
              </div>
              <div className="text-right">
                {product.bidding ? (
                  <div className="overflow-hidden">
                    <p className="font-bold text-lg text-harvest-gold-500 animate-float">{getPrice()}</p>
                  </div>
                ) : (
                  <p className="font-bold text-lg transform transition-all duration-300 group-hover:scale-110 group-hover:text-farm-green-600">{getPrice()}</p>
                )}
              </div>
            </div>
          </div>
        </Link>
        
        {!product.bidding && (
          <div className="px-4 pb-4 transition-all duration-300">
            <AnimatedButton 
              variant={isAddingToCart ? "glowing" : "pulse"}
              size="default"
              onClick={handleAddToCart}
              className="w-full text-sm group"
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center">
                  <span className="animate-scale-in-center mr-2">✓</span> Added to Cart
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> 
                  Add to Cart
                </span>
              )}
            </AnimatedButton>
          </div>
        )}
      </div>
    </TiltCard>
  );
};

export default ProductCard;
