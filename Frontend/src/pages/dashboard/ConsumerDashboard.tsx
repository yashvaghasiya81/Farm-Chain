
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, Heart, Clock } from "lucide-react";

const ConsumerDashboard = () => {
  const { user } = useAuth();
  const { orders, fetchOrders, isLoading } = useMarketplace();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Get most recent 3 orders
      setRecentOrders(orders.slice(0, 3));
    }
  }, [orders]);

  return (
    <div className="container p-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Manage your orders and discover fresh produce</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <CardDescription>Your order history</CardDescription>
            </div>
            <Package className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Saved Items
              </CardTitle>
              <CardDescription>Products you've saved</CardDescription>
            </div>
            <Heart className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Active Bids
              </CardTitle>
              <CardDescription>Items you're bidding on</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Recent Orders</h2>
            <Button variant="outline" asChild>
              <Link to="/consumer/orders">View All Orders</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green-600"></div>
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: <span className="capitalize">{order.status}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                        <Button variant="outline" asChild size="sm" className="mt-2">
                          <Link to={`/orders/${order.id}`}>Track Order</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">No orders yet</p>
                <p className="text-gray-500 mb-4">
                  Browse the marketplace to find fresh produce from local farmers
                </p>
                <Button asChild>
                  <Link to="/marketplace">Go to Marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Personalized Recommendations</h3>
              <p className="text-gray-500 mb-4">
                Shop more to get personalized product recommendations based on your preferences.
              </p>
              <Button asChild>
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumerDashboard;
