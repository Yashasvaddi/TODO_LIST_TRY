import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Layers, ZoomIn, ZoomOut } from 'lucide-react';

// Mock GeoJSON data for Indian farms
const mockFarmData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "farm_001",
        name: "राम किशन का खेत",
        farmer: "राम किशन शर्मा",
        crop: "धान",
        area: "2.5 एकड़",
        ndvi: 0.82,
        status: "स्वस्थ",
        state: "उत्तर प्रदेश",
        district: "कानपुर"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.123, 26.456],
          [80.126, 26.456],
          [80.126, 26.459],
          [80.123, 26.459],
          [80.123, 26.456]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "farm_002",
        name: "सुनीता देवी का खेत",
        farmer: "सुनीता देवी",
        crop: "गेहूं",
        area: "1.8 एकड़",
        ndvi: 0.75,
        status: "मध्यम",
        state: "बिहार",
        district: "पटना"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [85.118, 25.461],
          [85.121, 25.461],
          [85.121, 25.464],
          [85.118, 25.464],
          [85.118, 25.461]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "farm_003",
        name: "अमित पटेल का खेत",
        farmer: "अमित कुमार पटेल",
        crop: "कपास",
        area: "3.2 एकड़",
        ndvi: 0.68,
        status: "सुधार आवश्यक",
        state: "गुजरात",
        district: "अहमदाबाद"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [72.112, 23.466],
          [72.115, 23.466],
          [72.115, 23.470],
          [72.112, 23.470],
          [72.112, 23.466]
        ]]
      }
    }
  ]
};

export function MapViewer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Mock Leaflet initialization
    // In real implementation, this would initialize the actual Leaflet map
    /*
    import L from 'leaflet';
    
    if (mapRef.current && !mapReady) {
      const map = L.map(mapRef.current).setView([38.4575, -120.1205], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Add GeoJSON layer
      L.geoJSON(mockFarmData, {
        style: (feature) => ({
          fillColor: getColorByNDVI(feature.properties.ndvi),
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
        }),
        onEachFeature: (feature, layer) => {
          layer.on('click', () => {
            setSelectedFarm(feature.properties);
          });
        }
      }).addTo(map);
      
      setMapReady(true);
    }
    */
    
    // Mock setup complete
    setMapReady(true);
  }, [mapReady]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>राष्ट्रीय कृषि मानचित्र</h1>
        <p className="text-muted-foreground">
          छोटे और सीमांत किसानों के खेतों का भू-स्थानिक विश्लेषण और NDVI डेटा
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              राज्यवार किसान खेत मानचित्र
            </CardTitle>
            <CardDescription>
              खेत के बहुभुज पर क्लिक करके विवरण देखें
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div 
                ref={mapRef} 
                className="w-full h-96 bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-border"
              >
                <div className="text-center">
                  <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    भारतीय कृषि मानचित्र (Leaflet Map)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    उत्पादन में: इंटरैक्टिव मानचित्र किसान खेतों के साथ
                  </p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <ZoomIn className="h-4 w-4 mr-1" />
                      Zoom In
                    </Button>
                    <Button variant="outline" size="sm">
                      <ZoomOut className="h-4 w-4 mr-1" />
                      Zoom Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Details Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>किसान खेत विवरण</CardTitle>
              <CardDescription>
                {selectedFarm ? 'चयनित खेत की जानकारी' : 'विवरण देखने के लिए खेत चुनें'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFarm ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{selectedFarm.name}</h3>
                    <p className="text-sm text-muted-foreground">किसान: {selectedFarm.farmer}</p>
                    <p className="text-sm text-muted-foreground">{selectedFarm.district}, {selectedFarm.state}</p>
                    <p className="text-sm text-muted-foreground">क्षेत्रफल: {selectedFarm.area}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">फसल:</span>
                    <Badge variant="outline">{selectedFarm.crop}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">NDVI:</span>
                    <Badge variant="secondary">{selectedFarm.ndvi}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">स्थिति:</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedFarm.status)}`} />
                      <span className="text-sm">{selectedFarm.status}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  विस्तृत जानकारी देखने के लिए मानचित्र में खेत के बहुभुज पर क्लिक करें।
                </p>
              )}
            </CardContent>
          </Card>

          {/* Farm List */}
          <Card>
            <CardHeader>
              <CardTitle>सभी पंजीकृत किसान</CardTitle>
              <CardDescription>राष्ट्रीय किसान डेटाबेस</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockFarmData.features.map((farm) => (
                  <Button
                    key={farm.properties.id}
                    variant={selectedFarm?.id === farm.properties.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedFarm(farm.properties)}
                  >
                    <div>
                      <p className="font-medium">{farm.properties.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {farm.properties.farmer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {farm.properties.crop} • {farm.properties.area} • NDVI: {farm.properties.ndvi}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Notice */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">मानचित्र एकीकरण स्थिति</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                यह एक मॉक implementation है। उत्पादन में यह उपयोग करेगा:
                <br />• इंटरैक्टिव मैपिंग के लिए Leaflet.js
                <br />• PostGIS डेटाबेस से रियल GeoJSON डेटा
                <br />• सैटेलाइट APIs से लाइव NDVI डेटा
                <br />• कस्टम polygon drawing और editing टूल्स
                <br />• भारतीय कृषि रिसर्च डेटा इंटीग्रेशन
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}