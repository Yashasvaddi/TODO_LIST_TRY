import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { PieChart, Pie, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Leaf, TestTube, MapPin, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { comprehensiveTranslations } from './comprehensive-translations';
import RegionComparison from './region-comparison';
import { 
  SoilHealthData,
  parseSoilHealthData,
  calculateRegionAverages,
  getSoilHealthRecommendations
} from '../utils/soil-health';

interface SoilHealthMonitorProps {
  language: 'hi' | 'en';
}

export function SoilHealthMonitor({ language }: SoilHealthMonitorProps) {
  const t = comprehensiveTranslations[language];
  const [, setSoilData] = useState<SoilHealthData[]>([]);
  // We'll use soilData when filtering by crop to find regions
  const [regionAverages, setRegionAverages] = useState<Record<string, SoilHealthData>>({});
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Starting to load data...');
        
        // Try multiple paths to find the CSV file
        const paths = [
          './data/soil-health-data.csv',
          '/data/soil-health-data.csv',
          '../data/soil-health-data.csv'
        ];
        
        let csvData = '';
        let loaded = false;
        
        for (const path of paths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              csvData = await response.text();
              console.log(`Successfully loaded data from ${path}, size: ${csvData.length} bytes`);
              loaded = true;
              break;
            }
          } catch (e) {
            console.log(`Failed to load from ${path}:`, e);
          }
        }
        
        if (!loaded) {
          throw new Error('Could not load soil health data from any path');
        }
        console.log('CSV data loaded successfully, content length:', csvData.length);
        
        if (!csvData || csvData.trim().length === 0) {
          throw new Error('Empty CSV data received');
        }

        console.log('First few characters of CSV:', csvData.slice(0, 100));
        
        const data = parseSoilHealthData(csvData);
        console.log(`Successfully parsed ${data.length} rows of data`);
        
        if (!data || data.length === 0) {
          throw new Error('No valid soil health data found after parsing');
        }

        const averages = calculateRegionAverages(data);
        const allRegions = Object.keys(averages).filter(region => {
          const isValid = averages[region] && averages[region].soilMetrics;
          if (!isValid) {
            console.warn(`Invalid region data for: ${region}`);
          }
          return isValid;
        });

        console.log(`Found ${allRegions.length} valid regions`);
        
        if (allRegions.length === 0) {
          throw new Error('No valid regions found in processed data');
        }

        setSoilData(data);
        setRegionAverages(averages);
        setRegions(allRegions);
        
        // Select first valid region with data validation
        const firstValidRegion = allRegions.find(region => averages[region] && averages[region].soilMetrics) || allRegions[0];
        if (!firstValidRegion) {
          throw new Error('Could not find a valid initial region');
        }
        
        setSelectedRegion(firstValidRegion);
        setLoading(false);

      } catch (error) {
        console.error('Error in soil health data loading:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getHealthStatus = (metrics: SoilHealthData['soilMetrics']) => {
    const total = (high: number, medium: number, low: number) => high + medium + low;
    const score = (high: number, medium: number, low: number) => 
      (high * 3 + medium * 2 + low) / (total(high, medium, low) || 1);

    const nitrogenScore = score(metrics.nitrogen.high, metrics.nitrogen.medium, metrics.nitrogen.low);
    const phosphorousScore = score(metrics.phosphorous.high, metrics.phosphorous.medium, metrics.phosphorous.low);
    const potassiumScore = score(metrics.potassium.high, metrics.potassium.medium, metrics.potassium.low);
    const phScore = metrics.ph.neutral * 3 + (metrics.ph.acidic + metrics.ph.alkaline) * 1.5;
    
    const overallScore = (nitrogenScore + phosphorousScore + potassiumScore + phScore) / 4 * 100;
    
    if (overallScore >= 80) return { status: 'excellent', color: 'default', text: language === 'hi' ? 'उत्कृष्ट' : 'Excellent' };
    if (overallScore >= 60) return { status: 'good', color: 'secondary', text: language === 'hi' ? 'अच्छा' : 'Good' };
    if (overallScore >= 40) return { status: 'moderate', color: 'secondary', text: language === 'hi' ? 'मध्यम' : 'Moderate' };
    return { status: 'poor', color: 'destructive', text: language === 'hi' ? 'खराब' : 'Poor' };
  };

  // Enhanced error and loading state handling
  if (loading || !regionAverages[selectedRegion]) {
    return (
      <div className="space-y-6">
        <div>
          <h1>{t.soilHealth}</h1>
          <div className="flex flex-col items-center justify-center py-12">
            {loading ? (
              <>
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">
                  {language === 'hi' 
                    ? 'डेटा लोड हो रहा है...'
                    : 'Loading soil health data...'
                  }
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {language === 'hi'
                    ? 'कृपया प्रतीक्षा करें'
                    : 'Please wait while we process the data'
                  }
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
                  <div className="text-red-500 text-lg font-semibold">
                    {language === 'hi'
                      ? 'डेटा लोड करने में समस्या हुई'
                      : 'Error loading soil health data'
                    }
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  {language === 'hi'
                    ? 'डेटा लोड नहीं हो सका। कृपया पेज को रिफ्रेश करें या कुछ देर बाद प्रयास करें।'
                    : 'Could not load the soil health data. Please refresh or try again later.'
                  }
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    {language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const selectedData = regionAverages[selectedRegion];
  const healthStatus = getHealthStatus(selectedData.soilMetrics);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1>{t.soilHealth}</h1>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'मिट्टी के स्वास्थ्य की निगरानी और विश्लेषण'
            : 'Soil health monitoring and analysis'
          }
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">High Nutrients (&gt;60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Medium Nutrients (30-60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">Low Nutrients (&lt;30%)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Soil Health Monitor</h2>
        </div>

        <div className="space-y-4">
          {/* View Type Selector */}
          <div>
            <label className="text-sm font-medium mb-1 block">View Type</label>
            <Tabs defaultValue="state" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="state">State-wise View</TabsTrigger>
                <TabsTrigger value="crop">Crop-wise View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="state" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Select State</label>
                  <Select
                    value={selectedRegion}
                    onValueChange={(value: string) => {
                      if (regionAverages[value]) {
                        setSelectedRegion(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions
                        .filter(region => regionAverages[region])
                        .sort((a, b) => a.localeCompare(b))
                        .map((region: string) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Display all crops for selected state */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Crops in {selectedRegion}</h3>
                  <div className="flex flex-wrap gap-2">
                    {regionAverages[selectedRegion]?.crops.map((crop: string) => (
                      <Badge key={crop} variant="secondary">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="crop" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Select Crop</label>
                  <Select
                    value={selectedData.crops[0] || ''}
                    onValueChange={(crop: string) => {
                      // Find all regions that grow this crop
                      const regionsWithCrop = Object.entries(regionAverages)
                        .filter(([_, data]) => data.crops.includes(crop))
                        .map(([region]) => region);

                      if (regionsWithCrop.length > 0) {
                        setSelectedRegion(regionsWithCrop[0]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(Object.values(regionAverages).flatMap(data => data.crops)))
                        .sort()
                        .map((crop: string) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Display all states for selected crop */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">States growing {selectedData.crops[0]}</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(regionAverages)
                      .filter(([_, data]) => data.crops.includes(selectedData.crops[0]))
                      .map(([region]) => (
                        <Badge 
                          key={region} 
                          variant={region === selectedRegion ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => setSelectedRegion(region)}
                        >
                          {region}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Health Status Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">Health Status</label>
            <Select
              value={healthStatus.status}
              onValueChange={(status: 'excellent' | 'good' | 'moderate' | 'poor') => {
                const matchingRegions = Object.entries(regionAverages)
                  .filter(([_, data]) => getHealthStatus(data.soilMetrics).status === status)
                  .map(([region]) => region);
                
                if (matchingRegions.length > 0) {
                  setSelectedRegion(matchingRegions[0]);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.soilHealthIndex}</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-baseline gap-2">
              {Math.round(
                ((selectedData.soilMetrics.nitrogen.high + 
                selectedData.soilMetrics.phosphorous.high + 
                selectedData.soilMetrics.potassium.high) / 3) * 100
              )}%
              <Badge variant={healthStatus.color as any} className="text-sm">
                {healthStatus.text}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Overall soil health score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.phLevel}</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(selectedData.soilMetrics.ph.acidic * 5.5 + 
                selectedData.soilMetrics.ph.neutral * 7 + 
                selectedData.soilMetrics.ph.alkaline * 8.5).toFixed(1)}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Acidic: {(selectedData.soilMetrics.ph.acidic * 100).toFixed(1)}%</span>
                <span>Neutral: {(selectedData.soilMetrics.ph.neutral * 100).toFixed(1)}%</span>
                <span>Alkaline: {(selectedData.soilMetrics.ph.alkaline * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crops</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              {selectedData.crops.slice(0, 3).map((crop: string, index: number) => (
                <div key={index}>{crop}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Location
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Lat: {selectedData.location.latitude.toFixed(4)}</div>
              <div>Lng: {selectedData.location.longitude.toFixed(4)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            {language === 'hi' ? 'अवलोकन' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="nutrients">
            {language === 'hi' ? 'पोषक तत्व' : 'Nutrients'}
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            {language === 'hi' ? 'सुझाव' : 'Recommendations'}
          </TabsTrigger>
          <TabsTrigger value="compare">
            {language === 'hi' ? 'तुलना' : 'Compare'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutrient Indices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Nitrogen Index */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Nitrogen Index</span>
                      <span className="text-sm font-medium">
                        {((selectedData.soilMetrics.nitrogen.high * 3 + 
                          selectedData.soilMetrics.nitrogen.medium * 2 + 
                          selectedData.soilMetrics.nitrogen.low * 1) * 100 / 3).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedData.soilMetrics.nitrogen.high * 100} 
                      className="h-2" 
                    />
                  </div>

                  {/* Phosphorous Index */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Phosphorous Index</span>
                      <span className="text-sm font-medium">
                        {((selectedData.soilMetrics.phosphorous.high * 3 + 
                          selectedData.soilMetrics.phosphorous.medium * 2 + 
                          selectedData.soilMetrics.phosphorous.low * 1) * 100 / 3).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedData.soilMetrics.phosphorous.high * 100} 
                      className="h-2" 
                    />
                  </div>

                  {/* Potassium Index */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Potassium Index</span>
                      <span className="text-sm font-medium">
                        {((selectedData.soilMetrics.potassium.high * 3 + 
                          selectedData.soilMetrics.potassium.medium * 2 + 
                          selectedData.soilMetrics.potassium.low * 1) * 100 / 3).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedData.soilMetrics.potassium.high * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>pH Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Acidic', value: selectedData.soilMetrics.ph.acidic * 100, fill: '#ef4444' },
                        { name: 'Neutral', value: selectedData.soilMetrics.ph.neutral * 100, fill: '#22c55e' },
                        { name: 'Alkaline', value: selectedData.soilMetrics.ph.alkaline * 100, fill: '#3b82f6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

          <TabsContent value="nutrients" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrient Distribution</CardTitle>
                  <CardDescription>
                    Distribution of major nutrients across high, medium, and low levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={[
                        {
                          name: 'Nitrogen',
                          High: selectedData.soilMetrics.nitrogen.high * 100,
                          Medium: selectedData.soilMetrics.nitrogen.medium * 100,
                          Low: selectedData.soilMetrics.nitrogen.low * 100
                        },
                        {
                          name: 'Phosphorous',
                          High: selectedData.soilMetrics.phosphorous.high * 100,
                          Medium: selectedData.soilMetrics.phosphorous.medium * 100,
                          Low: selectedData.soilMetrics.phosphorous.low * 100
                        },
                        {
                          name: 'Potassium',
                          High: selectedData.soilMetrics.potassium.high * 100,
                          Medium: selectedData.soilMetrics.potassium.medium * 100,
                          Low: selectedData.soilMetrics.potassium.low * 100
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="High" stackId="a" fill="#22c55e" />
                      <Bar dataKey="Medium" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="Low" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nutrient Details</CardTitle>
                  <CardDescription>
                    Detailed breakdown of each nutrient level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nitrogen */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nitrogen (N)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">High</div>
                        <div className="text-xl font-bold text-green-600">
                          {(selectedData.soilMetrics.nitrogen.high * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Medium</div>
                        <div className="text-xl font-bold text-yellow-600">
                          {(selectedData.soilMetrics.nitrogen.medium * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Low</div>
                        <div className="text-xl font-bold text-red-600">
                          {(selectedData.soilMetrics.nitrogen.low * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phosphorous */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Phosphorous (P)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">High</div>
                        <div className="text-xl font-bold text-green-600">
                          {(selectedData.soilMetrics.phosphorous.high * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Medium</div>
                        <div className="text-xl font-bold text-yellow-600">
                          {(selectedData.soilMetrics.phosphorous.medium * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Low</div>
                        <div className="text-xl font-bold text-red-600">
                          {(selectedData.soilMetrics.phosphorous.low * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Potassium */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Potassium (K)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">High</div>
                        <div className="text-xl font-bold text-green-600">
                          {(selectedData.soilMetrics.potassium.high * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Medium</div>
                        <div className="text-xl font-bold text-yellow-600">
                          {(selectedData.soilMetrics.potassium.medium * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Low</div>
                        <div className="text-xl font-bold text-red-600">
                          {(selectedData.soilMetrics.potassium.low * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* pH Levels */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">pH Levels</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Acidic</div>
                        <div className="text-xl font-bold text-red-600">
                          {(selectedData.soilMetrics.ph.acidic * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Neutral</div>
                        <div className="text-xl font-bold text-green-600">
                          {(selectedData.soilMetrics.ph.neutral * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Alkaline</div>
                        <div className="text-xl font-bold text-blue-600">
                          {(selectedData.soilMetrics.ph.alkaline * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardContent>
              <div className="space-y-4">
                {getSoilHealthRecommendations(selectedData.soilMetrics).map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p>{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <RegionComparison 
            regionData={regionAverages}
            selectedRegions={[selectedRegion]}
            onRegionSelect={(regions) => setSelectedRegion(regions[0])}
            language={language}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}