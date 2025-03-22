import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertCircle, ArrowLeft, Clock, Gavel, Users, UserCheck, Award } from "lucide-react";
import { Product } from "@/services/productService";
import { socket } from "@/lib/socket";

const LiveBidding = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { fetchProductById, placeBid } = useMarketplace();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidHistory, setBidHistory] = useState<Array<{
    amount: number;
    bidder: string;
    timestamp: Date;
  }>>([]);
  const [participants, setParticipants] = useState<number>(0);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  
  // Use refs to prevent stale closures and track component mount state
  const isMounted = useRef(true);
  const productRef = useRef<Product | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoaded = useRef(false); // Track if we've already loaded the product
  
  // Generate mock bid history (memoized to prevent re-creation)
  const generateMockBidHistory = useCallback((product: Product) => {
    if (!product.currentBid || !product.startingBid) return [];
    
    const mockHistory = [];
    let currentAmount = product.startingBid;
    
    // Generate random mock bids from starting bid to current bid
    while (currentAmount < (product.currentBid || 0)) {
      const bidIncrement = Math.random() * 2 + 0.5; // Random increment between 0.5 and 2.5
      currentAmount += bidIncrement;
      
      if (currentAmount > (product.currentBid || 0)) {
        currentAmount = product.currentBid || 0;
      }
      
      // Create mock bid with random user and time
      mockHistory.unshift({
        amount: currentAmount,
        bidder: getRandomBidderName(),
        timestamp: new Date(Date.now() - Math.random() * 1000000) // Random time in the past
      });
    }
    
    return mockHistory;
  }, []);
  
  // Get random bidder name for mock data
  const getRandomBidderName = useCallback(() => {
    const names = ["John D.", "Emma S.", "Michael T.", "Sarah P.", "Robert K.", "Lisa M."];
    return names[Math.floor(Math.random() * names.length)];
  }, []);
  
  // Load product on initial render
  useEffect(() => {
    isMounted.current = true;
    
    const loadProduct = async () => {
      if (!id || hasLoaded.current) return; // Skip if we've already loaded
      
      try {
        setIsLoading(true);
        setError(null);
        
        const productData = await fetchProductById(id);
        
        if (!isMounted.current) return;
        
        if (!productData) {
          setError("Product not found");
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          });
          navigate("/marketplace");
          return;
        }
        
        // Verify this is an auction product
        if (!productData.bidding) {
          setError("This is not an auction product");
          toast({
            title: "Error",
            description: "This is not an auction product",
            variant: "destructive",
          });
          navigate(`/product/${id}`);
          return;
        }
        
        hasLoaded.current = true; // Mark as loaded
        setProduct(productData);
        productRef.current = productData;
        
        // Set initial bid amount
        const minimumNextBid = (productData.currentBid || productData.startingBid || 0) + 0.5;
        setBidAmount(minimumNextBid);
        
        // Set mock data only once
        if (bidHistory.length === 0) {
          const mockBidHistory = generateMockBidHistory(productData);
          setBidHistory(mockBidHistory);
          setParticipants(Math.floor(Math.random() * 10) + 3);
        }
        
      } catch (error) {
        console.error("Error loading product:", error);
        
        if (isMounted.current) {
          setError("Failed to load product details");
          toast({
            title: "Error",
            description: "Failed to load product details",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadProduct();
    
    return () => {
      isMounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]); // Removed dependencies that could cause re-renders
  
  // Set up socket connection for real-time updates
  useEffect(() => {
    if (!product) return;
    
    // Join the auction room
    socket.emit("joinAuction", { auctionId: product.id });
    
    // Listen for new bids
    const handleNewBid = (data) => {
      if (!isMounted.current) return;
      
      // Update product with new bid
      setProduct(prevProduct => {
        if (!prevProduct) return null;
        
        return {
          ...prevProduct,
          currentBid: data.amount,
          bidder: data.bidder
        };
      });
      
      // Update bid history
      setBidHistory(prev => [
        {
          amount: data.amount,
          bidder: typeof data.bidder === 'object' ? data.bidder.name : 'Anonymous',
          timestamp: new Date()
        },
        ...prev
      ]);
      
      // Update minimum bid amount
      setBidAmount(data.amount + 0.5);
      
      // Show toast notification
      toast({
        title: "New Bid Placed!",
        description: `${typeof data.bidder === 'object' ? data.bidder.name : 'Anonymous'} bid $${data.amount.toFixed(2)}`,
      });
    };
    
    // Listen for participant count updates
    const handleParticipantUpdate = (data) => {
      if (isMounted.current) {
        setParticipants(data.count);
      }
    };
    
    socket.on("newBid", handleNewBid);
    socket.on("participantUpdate", handleParticipantUpdate);
    
    return () => {
      // Leave the auction room
      socket.emit("leaveAuction", { auctionId: product.id });
      socket.off("newBid", handleNewBid);
      socket.off("participantUpdate", handleParticipantUpdate);
    };
  }, [product?.id]); // Only depend on product.id, not the entire product object
  
  // Update time left for auction - only set up once when product loads
  useEffect(() => {
    if (!product || !product.bidding || !product.endBidTime) return;
    
    const calculateTimeLeft = () => {
      if (!isMounted.current || !productRef.current?.endBidTime) return;
      
      try {
        const endTime = new Date(productRef.current.endBidTime).getTime();
        const now = new Date().getTime();
        const difference = endTime - now;
        
        if (difference <= 0) {
          setTimeLeft("Auction ended");
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        let newTimeLeft = "";
        if (days > 0) {
          newTimeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours > 0) {
          newTimeLeft = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          newTimeLeft = `${minutes}m ${seconds}s`;
        } else {
          newTimeLeft = `${seconds}s`;
        }
        
        setTimeLeft(newTimeLeft);
      } catch (error) {
        console.error("Error calculating time left:", error);
      }
    };
    
    calculateTimeLeft(); // Calculate immediately
    
    // Only set up timer if it doesn't exist yet
    if (!timerRef.current) {
      timerRef.current = setInterval(calculateTimeLeft, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [product?.id]); // Only depend on product.id
  
  const handlePlaceBid = async () => {
    if (!product || !bidAmount || !isAuthenticated || !user) return;
    
    // Check if bid is high enough
    if (bidAmount <= (product.currentBid || product.startingBid || 0)) {
      toast({
        title: "Bid too low",
        description: `Your bid must be higher than $${(product.currentBid || product.startingBid || 0).toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsPlacingBid(true);
    
    try {
      const updatedProduct = await placeBid(product.id, bidAmount);
      
      if (!isMounted.current) return;
      
      if (updatedProduct) {
        setProduct(updatedProduct);
        productRef.current = updatedProduct;
        
        // Add to bid history
        setBidHistory(prev => [
          {
            amount: bidAmount,
            bidder: user.name || "You",
            timestamp: new Date()
          },
          ...prev
        ]);
        
        // Update minimum bid
        setBidAmount(bidAmount + 0.5);
        
        toast({
          title: "Bid Placed!",
          description: `You successfully bid $${bidAmount.toFixed(2)}`,
        });
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      
      if (isMounted.current) {
        toast({
          title: "Bid Failed",
          description: "Failed to place your bid. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsPlacingBid(false);
      }
    }
  };
  
  // Return loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green-600"></div>
        </div>
      </div>
    );
  }
  
  // Return error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "Product not found"}</p>
          <Button onClick={() => navigate("/marketplace")}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Product
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Info Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                by {product.farmerName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AspectRatio ratio={1}>
                <img 
                  src={(product.images && product.images.length > 0) ? product.images[0] : "/placeholder.jpg"} 
                  alt={product.name}
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Starting Bid:</span>
                  <span className="font-semibold">${product.startingBid?.toFixed(2) || "0.00"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Bid:</span>
                  <span className="font-bold text-lg text-farm-green-600">
                    ${(product.currentBid || product.startingBid || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Highest Bidder:</span>
                  <Badge variant="outline" className="flex items-center">
                    <UserCheck className="h-3 w-3 mr-1" />
                    {product.bidder 
                      ? (typeof product.bidder === 'object' && product.bidder !== null 
                          ? (product.bidder.name || "Anonymous") 
                          : (typeof product.bidder === 'string' ? product.bidder : "Anonymous"))
                      : "No bids yet"}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-orange-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="font-bold">{timeLeft}</span>
                </div>
                
                <Badge>
                  <Users className="h-3 w-3 mr-1" />
                  {participants} bidders
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Live Bidding Column */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel className="h-5 w-5 mr-2" />
                Place Your Bid
              </CardTitle>
              <CardDescription>
                Enter your bid amount below. Minimum bid increment is $0.50.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Input 
                    type="number" 
                    value={bidAmount?.toString() || ""}
                    onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                    min={(product.currentBid || product.startingBid || 0) + 0.01}
                    step="0.5"
                    placeholder="Enter bid amount"
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum bid: ${((product.currentBid || product.startingBid || 0) + 0.5).toFixed(2)}
                  </p>
                </div>
                <Button 
                  onClick={handlePlaceBid}
                  disabled={
                    !isAuthenticated || 
                    !bidAmount || 
                    bidAmount <= (product.currentBid || product.startingBid || 0) ||
                    isPlacingBid
                  }
                  className="bg-harvest-gold-600 hover:bg-harvest-gold-700 h-12 md:w-1/3"
                >
                  {isPlacingBid ? (
                    <div className="flex items-center">
                      <span className="animate-spin h-4 w-4 border-b-2 border-white mr-2"></span>
                      Bidding...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
                    </div>
                  )}
                </Button>
              </div>
              
              {!isAuthenticated && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-amber-800">
                      You need to be logged in to place a bid.
                    </p>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-amber-600"
                      onClick={() => navigate("/login")}
                    >
                      Log in now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Bid History
              </CardTitle>
              <CardDescription>
                Recent bids on this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {bidHistory.le