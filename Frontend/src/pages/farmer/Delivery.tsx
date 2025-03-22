import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Truck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

// Mock data - replace with actual API calls
const mockDeliveries = [
  {
    id: 'DEL001',
    orderId: 'ORD123',
    customer: 'John Doe',
    address: 'Manki Complex, Valetva, Anand, Gujarat',
    status: 'pending',
    items: ['Organic Tomatoes', 'Fresh Carrots'],
    date: '2024-03-25',
    time: '14:00-16:00'
  },
  {
    id: 'DEL002',
    orderId: 'ORD124',
    customer: 'Jane Smith',
    address: '456 Market Road, Anand, Gujarat',
    status: 'in_transit',
    items: ['Farm Fresh Eggs', 'Organic Milk'],
    date: '2024-03-25',
    time: '10:00-12:00'
  },
  {
    id: 'DEL003',
    orderId: 'ORD125',
    customer: 'Mike Johnson',
    address: '789 Farm Lane, Anand, Gujarat',
    status: 'delivered',
    items: ['Organic Apples', 'Fresh Spinach'],
    date: '2024-03-24',
    time: '15:00-17:00'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in_transit':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_transit':
      return 'In Transit';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
};

const DeliveryPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Delivery Management</h2>
          <p className="text-gray-600">Manage and track your product deliveries</p>
        </div>
        <Button className="bg-farm-green-600 hover:bg-farm-green-700">
          <Truck className="h-4 w-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Deliveries
            </CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">4 completed, 8 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">Est. completion in 2 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Delivery Success Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-green-500">+2% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="in_transit">In Transit</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {mockDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">Order #{delivery.orderId}</h3>
                        <Badge className={getStatusColor(delivery.status)}>
                          {getStatusText(delivery.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{delivery.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{delivery.date}</p>
                      <p className="text-sm text-gray-600">{delivery.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span>{delivery.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>{delivery.items.join(', ')}</span>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {delivery.status === 'pending' && (
                      <Button size="sm">
                        Start Delivery
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryPage; 