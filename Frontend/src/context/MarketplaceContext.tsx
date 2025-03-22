import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { toast } from "@/components/ui/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  farmerId: string;
  farmerName: string;
  images: string[];
  category: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  organic: boolean;
  bidding: boolean;
  currentBid?: number;
  endBidTime?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  trackingInfo?: any;
}

interface MarketplaceContextType {
  products: Product[];
  featuredProducts: Product[];
  cart: CartItem[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters?: any) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeBid: (productId: string, amount: number) => Promise<void>;
  createOrder: () => Promise<string | null>;
  fetchOrders: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = useCallback(async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(filters);
      setProducts(data);

      // Set featured products (could be based on different criteria)
      const featured = data.filter(p => p.organic && p.quantity > 10).slice(0, 6);
      setFeaturedProducts(featured);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductById = async (id: string): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const product = await productService.getProductById(id);
      if (!product) {
        setError("Product not found");
        return null;
      }
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product details. Please try again later.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product.id);

      if (existingItemIndex !== -1) {
        // Update quantity if item already in cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, {
          productId: product.id,
          quantity,
          product
        }];
      }
    });

    toast({
      title: "Product added to cart",
      description: `${quantity} x ${product.name} added to your shopping cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    
    toast({
      title: "Product removed",
      description: "Item removed from your shopping cart.",
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeBid = async (productId: string, amount: number) => {
    try {
      await productService.placeBid(productId, amount);
      
      // Update local product data with new bid
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, currentBid: amount } 
            : product
        )
      );

      toast({
        title: "Bid placed successfully",
        description: `Your bid of $${amount} has been placed.`,
      });
    } catch (error) {
      toast({
        title: "Bid failed",
        description: "There was an error placing your bid. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createOrder = async (): Promise<string | null> => {
    if (cart.length === 0) {
      toast({
        title: "Cannot create order",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return null;
    }

    try {
      const orderId = await orderService.createOrder(cart);
      clearCart();
      
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and is being processed.",
      });
      
      return orderId;
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const userOrders = await orderService.getOrders();
      setOrders(userOrders as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    products,
    featuredProducts,
    cart,
    orders,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    placeBid,
    createOrder,
    fetchOrders,
  };

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};
