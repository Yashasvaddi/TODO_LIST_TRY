import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { SoilHealthData } from '../utils/soil-health';

interface RegionComparisonProps {
  regionData: Record<string, SoilHealthData>;
  selectedRegions: string[];
  onRegionSelect: (regions: string[]) => void;
  language: 'hi' | 'en';
}

export default function RegionComparison({ 
  regionData, 
  selectedRegions,
  onRegionSelect,
  language 
}: RegionComparisonProps) {
  const regions = Object.keys(regionData);

  // Calculate nutrient indices for comparison
  const comparisonData = selectedRegions.map(region => {
    const data = regionData[region];
    return {
      region,
      nitrogenIndex: data.soilMetrics.nitrogen.high * 3 + 
                     data.soilMetrics.nitrogen.medium * 2 + 
                     data.soilMetrics.nitrogen.low,
      phosphorousIndex: data.soilMetrics.phosphorous.high * 3 + 
                       data.soilMetrics.phosphorous.medium * 2 + 
                       data.soilMetrics.phosphorous.low,
      potassiumIndex: data.soilMetrics.potassium.high * 3 + 
                      data.soilMetrics.potassium.medium * 2 + 
                      data.soilMetrics.potassium.low,
      phIndex: data.soilMetrics.ph.neutral * 3 +
              (data.soilMetrics.ph.acidic + data.soilMetrics.ph.alkaline) * 1.5
    };
  });

  // Prepare radar chart data
  const radarData = selectedRegions.map(region => {
    const metrics = regionData[region].soilMetrics;
    return {
      region,
      'Nitrogen': metrics.nitrogen.high * 100,
      'Phosphorous': metrics.phosphorous.high * 100,
      'Potassium': metrics.potassium.high * 100,
      'pH Balance': metrics.ph.neutral * 100
    };
  });

  const handleRegionSelect = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionSelect(selectedRegions.filter(r => r !== region));
    } else if (selectedRegions.length < 3) {
      onRegionSelect([...selectedRegions, region]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Region Comparison</CardTitle>
          <CardDescription>Compare soil health metrics across different regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Region Selectors */}
              <Select
                value=""
                onValueChange={handleRegionSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add region to compare" />
                </SelectTrigger>
                <SelectContent>
                  {regions
                    .filter(region => !selectedRegions.includes(region))
                    .map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Regions */}
            <div className="flex gap-2">
              {selectedRegions.map(region => (
                <div 
                  key={region}
                  className="bg-primary/10 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {region}
                  <button 
                    onClick={() => handleRegionSelect(region)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Charts */}
            {selectedRegions.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Bar Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="nitrogenIndex" name="Nitrogen" fill="#8884d8" />
                      <Bar dataKey="phosphorousIndex" name="Phosphorous" fill="#82ca9d" />
                      <Bar dataKey="potassiumIndex" name="Potassium" fill="#ffc658" />
                      <Bar dataKey="phIndex" name="pH Balance" fill="#ff7c43" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Radar Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="region" />
                      <PolarRadiusAxis />
                      {selectedRegions.map((region, index) => (
                        <Radar
                          key={region}
                          name={region}
                          dataKey={region}
                          stroke={`hsl(${index * 120}, 70%, 50%)`}
                          fill={`hsl(${index * 120}, 70%, 50%)`}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}