// Mock product service - would be replaced with real API calls

interface Product {
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

// Mock data - would be fetched from an API in a real application
const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Organic Apples",
    description: "Fresh organic apples grown without pesticides. Perfect for healthy snacking and cooking.",
    price: 3.99,
    farmerId: "user2",
    farmerName: "Green Valley Farm",
    images: ["/placeholder.jpg"],
    category: "Fruits",
    quantity: 50,
    unit: "lb",
    harvestDate: "2023-10-15",
    organic: true,
    bidding: false
  },
  {
    id: "prod2",
    name: "Fresh Tomatoes",
    description: "Vine-ripened tomatoes harvested at peak freshness. Great for salads and cooking.",
    price: 2.49,
    farmerId: "user2",
    farmerName: "Sunshine Farms",
    images: ["/placeholder.jpg"],
    category: "Vegetables",
    quantity: 30,
    unit: "lb",
    harvestDate: "2023-10-20",
    organic: false,
    bidding: false
  },
  {
    id: "prod3",
    name: "Organic Honey",
    description: "Pure, unfiltered honey from wildflower sources. Directly from our bee hives.",
    price: 8.99,
    farmerId: "user2",
    farmerName: "Bee Haven Apiaries",
    images: ["/placeholder.jpg"],
    category: "Dairy & Eggs",
    quantity: 20,
    unit: "jar",
    harvestDate: "2023-09-30",
    organic: true,
    bidding: false
  },
  {
    id: "prod4",
    name: "Premium Beef Cuts",
    description: "Grass-fed, free-range beef cuts. Hormone and antibiotic-free.",
    price: 12.99,
    farmerId: "user2",
    farmerName: "Green Pastures Ranch",
    images: ["/placeholder.jpg"],
    category: "Meat",
    quantity: 15,
    unit: "lb",
    harvestDate: "2023-10-18",
    organic: true,
    bidding: true,
    currentBid: 13.50,
    endBidTime: "2023-11-10T15:00:00Z"
  },
  {
    id: "prod5",
    name: "Fresh Farm Eggs",
    description: "Free-range chicken eggs collected daily. Rich in flavor and nutrients.",
    price: 4.99,
    farmerId: "user2",
    farmerName: "Happy Hen Farm",
    images: ["/placeholder.jpg"],
    category: "Dairy & Eggs",
    quantity: 40,
    unit: "dozen",
    harvestDate: "2023-10-22",
    organic: true,
    bidding: false
  },
  {
    id: "prod6",
    name: "Heirloom Carrots",
    description: "Colorful mix of heirloom carrot varieties. Sweet and flavorful.",
    price: 3.49,
    farmerId: "user2",
    farmerName: "Rainbow Harvest",
    images: ["/placeholder.jpg"],
    category: "Vegetables",
    quantity: 25,
    unit: "bunch",
    harvestDate: "2023-10-19",
    organic: true,
    bidding: false
  },
  {
    id: "prod7",
    name: "Artisanal Cheese",
    description: "Small-batch, hand-crafted cheese made with traditional methods.",
    price: 6.99,
    farmerId: "user2",
    farmerName: "Valley Dairy",
    images: ["/placeholder.jpg"],
    category: "Dairy & Eggs",
    quantity: 15,
    unit: "piece",
    harvestDate: "2023-10-10",
    organic: false,
    bidding: true,
    currentBid: 7.25,
    endBidTime: "2023-11-05T18:00:00Z"
  },
  {
    id: "prod8",
    name: "Fresh Basil",
    description: "Aromatic basil grown in our greenhouse. Perfect for Italian dishes.",
    price: 2.99,
    farmerId: "user2",
    farmerName: "Herb Haven",
    images: ["/placeholder.jpg"],
    category: "Herbs",
    quantity: 30,
    unit: "bunch",
    harvestDate: "2023-10-21",
    organic: true,
    bidding: false
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getProducts: async (filters?: any): Promise<Product[]> => {
    // Simulate API delay
    await delay(800);
    
    let filteredProducts = [...mockProducts];
    
    // Apply filters if they exist
    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      if (filters.organic !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.organic === filters.organic);
      }
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return filteredProducts;
  },
  
  getProductById: async (id: string): Promise<Product> => {
    // Simulate API delay
    await delay(500);
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    
    return product;
  },
  
  placeBid: async (productId: string, amount: number): Promise<void> => {
    // Simulate API delay
    await delay(700);
    
    const productIndex = mockProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    
    const product = mockProducts[productIndex];
    if (!product.bidding) {
      throw new Error("This product does not accept bids");
    }
    
    if (product.currentBid && amount <= product.currentBid) {
      throw new Error("Bid must be higher than current bid");
    }
    
    // Update the product with the new bid
    mockProducts[productIndex] = {
      ...product,
      currentBid: amount
    };
  },
  
  // Add more methods as needed for the marketplace functionality
};
