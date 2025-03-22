import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight, ShieldCheck, Truck, Leaf, Clock } from "lucide-react";

const Home = () => {
  const { featuredProducts, fetchProducts, isLoading } = useMarketplace();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-farm-green-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-farm-green-900 mb-4">
                Farm Fresh Products Direct to Your Table
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Connect directly with local farmers through our blockchain-powered 
                marketplace. Transparency, quality, and sustainability in every purchase.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" className="bg-farm-green-600 hover:bg-farm-green-700">
                  <Link to="/marketplace">
                    Browse Marketplace
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-farm-green-600 text-farm-green-600">
                  <Link to="/register">
                    Join as Farmer
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/placeholder.jpg" 
                  alt="Farm Fresh Products" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FarmChain?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-14 w-14 bg-farm-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-7 w-7 text-farm-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainable Farming</h3>
              <p className="text-gray-600">
                Support eco-friendly farming practices that preserve our environment for future generations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-14 w-14 bg-farm-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-farm-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Verified</h3>
              <p className="text-gray-600">
                Every product is tracked on blockchain for complete transparency from farm to table.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-14 w-14 bg-farm-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-7 w-7 text-farm-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get fresh produce delivered to your doorstep quickly with our efficient logistics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-14 w-14 bg-farm-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-7 w-7 text-farm-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Farm Fresh</h3>
              <p className="text-gray-600">
                Products harvested at peak freshness and delivered directly without middlemen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/marketplace" className="text-farm-green-600 hover:text-farm-green-700 font-medium flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-farm-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Farm Fresh Products?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who enjoy fresh, sustainable produce directly from local farmers.
          </p>
          <Button asChild size="lg" className="bg-white text-farm-green-700 hover:bg-gray-100">
            <Link to="/register">
              Create an Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
