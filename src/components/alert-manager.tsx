import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertTriangle, CheckCircle, Clock, X, Bell, Filter } from 'lucide-react';
import { FilterControls } from './filter-controls';
import { useFilters } from './filter-provider';
import { comprehensiveTranslations } from './comprehensive-translations';
import { generateAlertData, filterData, AlertData } from './mock-data-generator';

interface AlertManagerProps {
  language: 'hi' | 'en';
}

export function AlertManager({ language }: AlertManagerProps) {
  const { selectedDistrict, selectedTimeRange, customTimeRange } = useFilters();
  const t = comprehensiveTranslations[language];
  
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Generate and filter alert data
  const allAlerts = useMemo(() => generateAlertData(language), [language]);
  const timeRange = customTimeRange || selectedTimeRange;
  
  const filteredAlerts = useMemo(() => {
    let alerts = filterData(allAlerts, selectedDistrict, timeRange.start, timeRange.end);
    
    // Apply additional filters
    alerts = alerts.filter(alert => {
      if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
      if (filterStatus !== 'all' && alert.type !== filterType) return false;
      return true;
    });

    return alerts.slice(0, 20); // Limit to 20 alerts for better performance
  }, [allAlerts, selectedDistrict, timeRange, filterSeverity, filterType]);

  const handleStatusChange = (alertId: string, newStatus: string) => {
    // In production: await updateAlertStatus(alertId, newStatus);
    console.log(`Alert ${alertId} status changed to ${newStatus}`);
  };

  const handleDismissAlert = (alertId: string) => {
    // In production: await dismissAlert(alertId);
    console.log(`Alert ${alertId} dismissed`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather': return '🌧️';
      case 'pest': return '🐛';
      case 'disease': return '🦠';
      case 'price': return '📈';
      default: return '⚠️';
    }
  };

  const alertCounts = useMemo(() => {
    const active = filteredAlerts.filter(a => a.severity === 'high').length;
    const medium = filteredAlerts.filter(a => a.severity === 'medium').length;
    const low = filteredAlerts.filter(a => a.severity === 'low').length;
    
    return { active, medium, low, total: filteredAlerts.length };
  }, [filteredAlerts]);

  const getAlertTypeText = (type: string) => {
    const types = {
      weather: { hi: 'मौसम चेतावनी', en: 'Weather Alert' },
      pest: { hi: 'कीट चेतावनी', en: 'Pest Alert' },
      disease: { hi: 'बीमारी चेतावनी', en: 'Disease Alert' },
      price: { hi: 'मूल्य चेतावनी', en: 'Price Alert' }
    };
    return types[type as keyof typeof types]?.[language] || type;
  };

  const getSeverityText = (severity: string) => {
    const severities = {
      high: { hi: 'उच्च', en: 'High' },
      medium: { hi: 'मध्यम', en: 'Medium' },
      low: { hi: 'कम', en: 'Low' }
    };
    return severities[severity as keyof typeof severities]?.[language] || severity;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1>{language === 'hi' ? 'अलर्ट प्रबंधन केंद्र' : 'Alert Management Center'}</h1>
          {alertCounts.active > 0 && (
            <Badge variant="destructive" className="gap-1">
              <Bell className="h-3 w-3" />
              {alertCounts.active} {language === 'hi' ? 'सक्रिय' : 'Active'}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'कृषि अलर्ट और अधिसूचनाओं की निगरानी और प्रबंधन करें'
            : 'Monitor and manage agricultural alerts and notifications'
          }
        </p>
      </div>

      <FilterControls language={language} />

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'hi' ? 'कुल अलर्ट' : 'Total Alerts'}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertCounts.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'hi' ? 'उच्च प्राथमिकता' : 'High Priority'}
            </CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alertCounts.active}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'hi' ? 'मध्यम प्राथमिकता' : 'Medium Priority'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alertCounts.medium}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'hi' ? 'कम प्राथमिकता' : 'Low Priority'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alertCounts.low}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {language === 'hi' ? 'अलर्ट फिल्टर' : 'Alert Filters'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'hi' ? 'गंभीरता' : 'Severity'}
              </label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'hi' ? 'सभी' : 'All'}</SelectItem>
                  <SelectItem value="high">{language === 'hi' ? 'उच्च' : 'High'}</SelectItem>
                  <SelectItem value="medium">{language === 'hi' ? 'मध्यम' : 'Medium'}</SelectItem>
                  <SelectItem value="low">{language === 'hi' ? 'कम' : 'Low'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'hi' ? 'प्रकार' : 'Type'}
              </label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'hi' ? 'सभी' : 'All'}</SelectItem>
                  <SelectItem value="weather">{language === 'hi' ? 'मौसम' : 'Weather'}</SelectItem>
                  <SelectItem value="pest">{language === 'hi' ? 'कीट' : 'Pest'}</SelectItem>
                  <SelectItem value="disease">{language === 'hi' ? 'बीमारी' : 'Disease'}</SelectItem>
                  <SelectItem value="price">{language === 'hi' ? 'मूल्य' : 'Price'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={alert.severity === 'high' ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{getAlertTypeText(alert.type)}</CardTitle>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {getSeverityText(alert.severity)}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {alert.message}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusChange(alert.id, 'acknowledged')}
                  >
                    {language === 'hi' ? 'स्वीकार करें' : 'Acknowledge'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">
                    {language === 'hi' ? 'जिला:' : 'District:'}
                  </span> {alert.district}
                </div>
                <div>
                  <span className="font-medium">
                    {language === 'hi' ? 'प्रभावित:' : 'Affected:'}
                  </span> {alert.affected} {language === 'hi' ? 'किसान' : 'farmers'}
                </div>
                <div>
                  <span className="font-medium">
                    {language === 'hi' ? 'समय:' : 'Time:'}
                  </span> {alert.date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'वर्तमान फिल्टर से कोई अलर्ट मेल नहीं खाते'
                : 'No alerts match your current filters'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}