import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Leaf, Calendar, Tag, Store, Info, Clock, Users, MinusCircle, PlusCircle } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { fetchProductById, addToCart, placeBid, isLoading } = useMarketplace();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const productData = await fetchProductById(id);
          if (productData) {
            setProduct(productData);
            if (productData.bidding && productData.currentBid) {
              setBidAmount(productData.currentBid + 0.5); // Default bid slightly higher
            }
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load product details",
            variant: "destructive",
          });
        }
      }
    };
    
    loadProduct();
  }, [id, fetchProductById, toast]);
  
  // Update time left for auction
  useEffect(() => {
    if (!product?.bidding || !product?.endBidTime) return;
    
    const calculateTimeLeft = () => {
      const endTime = new Date(product.endBidTime).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;
      
      if (difference <= 0) {
        setTimeLeft("Auction ended");
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days} days, ${hours} hours left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} hours, ${minutes} minutes left`);
      } else {
        setTimeLeft(`${minutes} minutes left`);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [product]);
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handlePlaceBid = async () => {
    if (!product || !bidAmount) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to place a bid",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      await placeBid(product.id, bidAmount);
      toast({
        title: "Bid placed",
        description: `Your bid of $${bidAmount.toFixed(2)} has been placed successfully`,
      });
      // Update product with new bid
      setProduct({
        ...product,
        currentBid: bidAmount,
      });
    } catch (error) {
      toast({
        title: "Bid failed",
        description: error instanceof Error ? error.message : "Failed to place bid",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-2">
              <AspectRatio ratio={4/3}>
                <img 
                  src={product.images[0] || "/placeholder.jpg"} 
                  alt={product.name}
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
            </CardContent>
          </Card>
          
          {/* Additional Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img: string, idx: number) => (
                <div key={idx} className="aspect-square">
                  <img 
                    src={img || "/placeholder.jpg"} 
                    alt={`${product.name} ${idx+1}`}
                    className="rounded-md object-cover w-full h-full cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.organic && (
                <Badge className="bg-farm-green-500">
                  <Leaf className="h-3 w-3 mr-1" /> Organic
                </Badge>
              )}
              <Badge variant="outline">
                <Tag className="h-3 w-3 mr-1" /> {product.category}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-center mt-2 text-gray-600">
              <Store className="h-4 w-4 mr-1" />
              <span>{product.farmerName}</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Price or Bid Section */}
          <div>
            {product.bidding ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-3xl font-bold">${(product.currentBid || product.price).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" /> {timeLeft}
                    </p>
                    <p className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" /> 5 bidders
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-grow">
                    <Input 
                      type="number" 
                      value={bidAmount?.toString() || ""}
                      onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                      min={(product.currentBid || product.price) + 0.01}
                      step="0.5"
                    />
                  </div>
                  <Button 
                    onClick={handlePlaceBid}
                    disabled={!bidAmount || bidAmount <= (product.currentBid || product.price)}
                  >
                    Place Bid
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Enter ${((product.currentBid || product.price) + 0.5).toFixed(2)} or more
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-3xl font-bold">${product.price.toFixed(2)} <span className="text-lg font-normal">/ {product.unit}</span></p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <p className="text-sm font-medium">Quantity:</p>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.quantity}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {product.quantity} {product.unit}s available
                  </p>
                </div>
                
                <Button 
                  onClick={handleAddToCart} 
                  className="w-full"
                  size="lg"
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Product Details Tabs */}
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold flex items-center mb-2">
                  <Info className="h-4 w-4 mr-2" /> Description
                </h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2" /> Harvest Date
                  </h3>
                  <p className="text-gray-700">
                    {new Date(product.harvestDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Certification</h3>
                  <p className="text-gray-700">
                    {product.organic ? "Certified Organic" : "Conventional"}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <p className="text-gray-700 mb-2">
                    Free local delivery for orders over $35.
                  </p>
                  <p className="text-gray-700">
                    Standard shipping: 2-4 business days.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Customer Reviews</h3>
                  <p className="text-gray-700">
                    No reviews yet for this product.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Write a Review
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
