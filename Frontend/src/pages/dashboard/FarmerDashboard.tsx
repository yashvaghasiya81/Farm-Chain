
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, PieChart, LineChart } from "lucide-react";

// Mock data - in a real app this would come from an API
const mockProducts = [
  { id: 1, name: "Organic Apples", stock: 50, sold: 75 },
  { id: 2, name: "Fresh Tomatoes", stock: 30, sold: 40 },
  { id: 3, name: "Organic Honey", stock: 20, sold: 15 },
];

const mockSalesData = [
  { month: "Jan", amount: 400 },
  { month: "Feb", amount: 600 },
  { month: "Mar", amount: 550 },
  { month: "Apr", amount: 700 },
  { month: "May", amount: 900 },
  { month: "Jun", amount: 750 },
];

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [activeListings, setActiveListings] = useState(mockProducts);
  const [salesData, setSalesData] = useState(mockSalesData);
  
  // In a real app, these would be API calls
  useEffect(() => {
    // Fetch active listings
    // Fetch sales data
  }, []);

  return (
    <div className="container p-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Manage your farm products and track sales</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Total Sales
              </CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </div>
            <BarChart className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$1,240.50</p>
            <p className="text-xs text-green-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Products Sold
              </CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </div>
            <PieChart className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">130</p>
            <p className="text-xs text-green-500">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Active Auctions
              </CardTitle>
              <CardDescription>Currently running</CardDescription>
            </div>
            <LineChart className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Products</h2>
            <Button variant="default">Add New Product</Button>
          </div>
          
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sold
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeListings.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{product.stock} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{product.sold} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Customer Orders</h3>
              <p className="text-gray-500 mb-4">
                You don't have any recent orders to fulfill.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Sales Analytics</h3>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Sales chart will be displayed here</p>
                {/* In a real app, we would render a chart component here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerDashboard;
