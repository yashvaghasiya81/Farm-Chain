import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Button } from "@/components/ui/button";

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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useMarketplace();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm card-hover">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.images[0] || "/placeholder.svg"} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.organic && (
            <Badge className="absolute top-2 left-2 bg-farm-green-500">
              <Leaf className="h-3 w-3 mr-1" /> Organic
            </Badge>
          )}
          {product.bidding && (
            <Badge className="absolute top-2 right-2 bg-harvest-gold-500">
              <Clock className="h-3 w-3 mr-1" /> Auction
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.farmerName}</p>
            </div>
            <div className="text-right">
              {product.bidding ? (
                <div>
                  <p className="font-bold text-lg">{formatPrice(product.currentBid || product.price)}</p>
                  <p className="text-xs text-gray-500">{getTimeLeft()}</p>
                </div>
              ) : (
                <p className="font-bold text-lg">{formatPrice(product.price)}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
      </Link>
      
      {!product.bidding && (
        <div className="px-4 pb-4">
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="w-full text-sm"
          >
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
