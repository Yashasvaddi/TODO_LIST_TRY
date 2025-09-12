import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Database, Edit3, Plus, Trash2, Save, AlertTriangle } from 'lucide-react';

// Mock data structures
const mockFarmData = [
  {
    id: 'farmer_001',
    name: 'राम किशन शर्मा',
    village: 'रामपुर',
    district: 'कानपुर',
    state: 'उत्तर प्रदेश',
    area: 2.5,
    crop: 'धान',
    mobile: '9876543210',
    aadhar: '1234-****-9012',
    status: 'सक्रिय',
    coordinates: '26.4575, 80.1205'
  },
  {
    id: 'farmer_002',
    name: 'सुनीता देवी',
    village: 'गंगापुर',
    district: 'पटना',
    state: 'बिहार',
    area: 1.8,
    crop: 'गेहूं',
    mobile: '9823456781',
    aadhar: '2345-****-0123',
    coordinates: '25.4612, 85.1188',
    status: 'सक्रिय'
  },
  {
    id: 'farmer_003',
    name: 'अमित कुमार पटेल',
    village: 'बावला',
    district: 'अहमदाबाद',
    state: 'गुजरात',
    area: 3.2,
    crop: 'कपास',
    mobile: '9534567812',
    aadhar: '3456-****-1234',
    status: 'सक्रिय',
    coordinates: '23.4698, 72.1156'
  }
];

const mockWeatherData = [
  {
    id: 'weather_001',
    farmId: 'farm_001',
    date: '2024-01-15',
    temperature: 24.5,
    humidity: 68,
    rainfall: 12.3,
    windSpeed: 8.2,
    conditions: 'Partly Cloudy'
  },
  {
    id: 'weather_002',
    farmId: 'farm_002',
    date: '2024-01-15',
    temperature: 26.1,
    humidity: 72,
    rainfall: 8.7,
    windSpeed: 6.5,
    conditions: 'Clear'
  }
];

const mockMarketData = [
  {
    id: 'market_001',
    commodity: 'Wheat',
    price: 285.50,
    currency: 'USD',
    unit: 'per ton',
    change: '+2.3%',
    market: 'Chicago Board of Trade',
    lastUpdated: '2024-01-15T14:30:00Z'
  },
  {
    id: 'market_002',
    commodity: 'Corn',
    price: 220.75,
    currency: 'USD',
    unit: 'per ton',
    change: '-1.2%',
    market: 'Chicago Board of Trade',
    lastUpdated: '2024-01-15T14:30:00Z'
  }
];

export function DataExplorer() {
  const [selectedTab, setSelectedTab] = useState('farms');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Mock save operation
    // In production: await saveToDatabase(editingItem);
    console.log('Saving:', editingItem);
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    // Mock delete operation
    // In production: await deleteFromDatabase(id);
    console.log('Deleting:', id);
  };

  const renderFarmTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Area (ha)</TableHead>
          <TableHead>Crop</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockFarmData.map((farm) => (
          <TableRow key={farm.id}>
            <TableCell className="font-medium">{farm.name}</TableCell>
            <TableCell>{farm.location}</TableCell>
            <TableCell>{farm.area}</TableCell>
            <TableCell>
              <Badge variant="outline">{farm.crop}</Badge>
            </TableCell>
            <TableCell>{farm.owner}</TableCell>
            <TableCell>
              <Badge variant={farm.status === 'active' ? 'default' : 'secondary'}>
                {farm.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(farm)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(farm.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderWeatherTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Farm ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Temperature (°C)</TableHead>
          <TableHead>Humidity (%)</TableHead>
          <TableHead>Rainfall (mm)</TableHead>
          <TableHead>Wind Speed (km/h)</TableHead>
          <TableHead>Conditions</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockWeatherData.map((weather) => (
          <TableRow key={weather.id}>
            <TableCell className="font-medium">{weather.farmId}</TableCell>
            <TableCell>{weather.date}</TableCell>
            <TableCell>{weather.temperature}</TableCell>
            <TableCell>{weather.humidity}</TableCell>
            <TableCell>{weather.rainfall}</TableCell>
            <TableCell>{weather.windSpeed}</TableCell>
            <TableCell>
              <Badge variant="outline">{weather.conditions}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(weather)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(weather.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderMarketTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Commodity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Market</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockMarketData.map((market) => (
          <TableRow key={market.id}>
            <TableCell className="font-medium">{market.commodity}</TableCell>
            <TableCell>{market.currency} {market.price}</TableCell>
            <TableCell>{market.unit}</TableCell>
            <TableCell>
              <Badge variant={market.change.startsWith('+') ? 'default' : 'destructive'}>
                {market.change}
              </Badge>
            </TableCell>
            <TableCell>{market.market}</TableCell>
            <TableCell>{new Date(market.lastUpdated).toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(market)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(market.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>Data Explorer</h1>
        <p className="text-muted-foreground">
          Browse and manage agricultural data (Mock Database Interface)
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Agricultural Data Management
              </CardTitle>
              <CardDescription>
                View, edit, and manage farm, weather, and market data
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="farms">Farms ({mockFarmData.length})</TabsTrigger>
              <TabsTrigger value="weather">Weather ({mockWeatherData.length})</TabsTrigger>
              <TabsTrigger value="market">Market ({mockMarketData.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="farms" className="space-y-4">
              <div className="rounded-md border">
                {renderFarmTable()}
              </div>
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <div className="rounded-md border">
                {renderWeatherTable()}
              </div>
            </TabsContent>

            <TabsContent value="market" className="space-y-4">
              <div className="rounded-md border">
                {renderMarketTable()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>
              Make changes to the selected record (Mock Edit Interface)
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              {Object.entries(editingItem).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Input
                    id={key}
                    value={value as string}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      [key]: e.target.value
                    })}
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Database Integration Notice */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Database Integration Status</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This interface currently operates on mock data. In production:
                <br />• PostgreSQL for relational farm and operational data
                <br />• MongoDB for unstructured sensor and satellite data
                <br />• Real-time CRUD operations with validation
                <br />• Data synchronization with Power BI datasets
                <br />• Audit logging and change tracking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}