import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, MessageSquare, Smartphone, AlertTriangle, TrendingUp, Languages } from 'lucide-react';
import { FilterControls } from './filter-controls';
import { useFilters } from './filter-provider';
import { comprehensiveTranslations } from './comprehensive-translations';
import { 
  generateFarmerData, 
  generateAlertData, 
  generateSoilData, 
  filterData,
  FarmerData,
  AlertData 
} from './mock-data-generator';

interface DashboardProps {
  language: 'hi' | 'en';
}

export function Dashboard({ language }: DashboardProps) {
  const { selectedDistrict, selectedTimeRange, customTimeRange } = useFilters();
  const t = comprehensiveTranslations[language];

  // Generate mock data
  const allFarmerData = useMemo(() => generateFarmerData(language), [language]);
  const allAlertData = useMemo(() => generateAlertData(language), [language]);
  const allSoilData = useMemo(() => generateSoilData(), []);

  // Apply filters
  const timeRange = customTimeRange || selectedTimeRange;
  const filteredFarmerData = useMemo(() => 
    filterData(allFarmerData, selectedDistrict, timeRange.start, timeRange.end),
    [allFarmerData, selectedDistrict, timeRange]
  );

  const filteredAlertData = useMemo(() => 
    filterData(allAlertData, selectedDistrict, timeRange.start, timeRange.end),
    [allAlertData, selectedDistrict, timeRange]
  );

  const filteredSoilData = useMemo(() => 
    filterData(allSoilData, selectedDistrict, timeRange.start, timeRange.end),
    [allSoilData, selectedDistrict, timeRange]
  );

  // Calculate KPIs from filtered data
  const kpis = useMemo(() => {
    const totalFarmers = filteredFarmerData.length;
    const totalQueries = filteredFarmerData.reduce((sum, farmer) => sum + farmer.queries, 0);
    const avgSoilHealth = filteredSoilData.length > 0 
      ? filteredSoilData.reduce((sum, soil) => sum + soil.healthScore, 0) / filteredSoilData.length
      : 0;
    const activeAlerts = filteredAlertData.filter(alert => alert.severity === 'high').length;

    return [
      {
        title: t.totalFarmers,
        value: totalFarmers.toLocaleString(),
        change: `+${Math.floor(totalFarmers * 0.05)}`,
        icon: Users,
        status: 'positive' as const
      },
      {
        title: t.monthlyQueries,
        value: totalQueries.toLocaleString(),
        change: `+${Math.floor(totalQueries * 0.08)}`,
        icon: MessageSquare,
        status: 'positive' as const
      },
      {
        title: t.soilHealthIndex,
        value: `${avgSoilHealth.toFixed(1)}%`,
        change: `+${(avgSoilHealth * 0.02).toFixed(1)}`,
        icon: TrendingUp,
        status: 'positive' as const
      },
      {
        title: t.recentAlerts,
        value: activeAlerts.toString(),
        change: `+${Math.floor(activeAlerts * 0.1)}`,
        icon: AlertTriangle,
        status: 'warning' as const
      },
    ];
  }, [filteredFarmerData, filteredSoilData, filteredAlertData, t]);

  // Prepare chart data
  const monthlyQueryData = useMemo(() => {
    const monthNames = language === 'hi' 
      ? ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: monthNames[index],
      queries: 0
    }));

    filteredFarmerData.forEach(farmer => {
      const month = farmer.date.getMonth();
      monthlyData[month].queries += farmer.queries;
    });

    return monthlyData;
  }, [filteredFarmerData, language]);

  const cropAdoptionData = useMemo(() => {
    const cropTypes = language === 'hi' 
      ? ['धान', 'गेहूं', 'कपास', 'गन्ना', 'मक्का']
      : ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize'];
    
    const cropData = cropTypes.map(crop => {
      const cropFarmers = filteredFarmerData.filter(farmer => 
        farmer.cropType.toLowerCase().includes(crop.toLowerCase()) || 
        crop.toLowerCase().includes(farmer.cropType.toLowerCase())
      );
      const avgYield = cropFarmers.length > 0 
        ? cropFarmers.reduce((sum, farmer) => sum + farmer.yield, 0) / cropFarmers.length
        : 0;
      
      return {
        crop: crop,
        adopted: Number(avgYield.toFixed(1)),
        target: Number((avgYield * 1.2).toFixed(1))
      };
    });

    return cropData;
  }, [filteredFarmerData, language]);

  return (
    <div className="space-y-6">
      <div>
        <h1>{t.welcomeTitle}</h1>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'छोटे और सीमांत किसानों के लिए AI-आधारित सलाहकार सेवाओं का रियल-टाइम अवलोकन'
            : 'Real-time monitoring of AI-based advisory services for small and marginal farmers'
          }
        </p>
      </div>

      <FilterControls language={language} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <Badge 
                variant={kpi.status === 'positive' ? 'default' : 
                        kpi.status === 'negative' ? 'destructive' : 
                        kpi.status === 'warning' ? 'secondary' : 'outline'}
                className="mt-1"
              >
                {kpi.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advisory Queries Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t.monthlyQueries}</CardTitle>
            <CardDescription>
              {language === 'hi' 
                ? 'किसानों द्वारा पूछे गए प्रश्नों का ट्रेंड'
                : 'Trend of queries asked by farmers'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyQueryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="queries" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop Adoption */}
        <Card>
          <CardHeader>
            <CardTitle>{t.cropAdoption}</CardTitle>
            <CardDescription>
              {language === 'hi' 
                ? 'AI सुझावों के अनुसार फसल उत्पादन (क्विंटल प्रति हेक्टेयर)'
                : 'Crop yield based on AI recommendations (Quintals per Hectare)'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropAdoptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="adopted" fill="hsl(var(--chart-1))" />
                <Bar dataKey="target" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Language Support & Reach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Languages className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  {language === 'hi' ? 'भाषा समर्थन' : 'Language Support'}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {language === 'hi' 
                    ? 'हिंदी, अंग्रेजी, पंजाबी समेत 12 भाषाओं में उपलब्ध'
                    : 'Available in 12 languages including Hindi, English, Punjabi'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {language === 'hi' ? 'पंजाब राज्य कवरेज' : 'Punjab State Coverage'}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {language === 'hi' 
                    ? `${selectedDistrict === 'All Districts' ? 'सभी 22 जिलों' : selectedDistrict} में सक्रिय`
                    : `Active in ${selectedDistrict === 'All Districts' ? 'all 22 districts' : selectedDistrict}`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}