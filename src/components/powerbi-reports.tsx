import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PieChart, BarChart3, TrendingUp, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';

// Mock Power BI report configurations
const mockReports = [
  {
    id: 'crop-analytics',
    name: 'Crop Analytics Dashboard',
    description: 'Comprehensive crop performance and yield analysis',
    status: 'ready',
    lastUpdated: '2024-01-15T10:30:00Z',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=mock-crop-analytics',
    datasetId: 'crop-dataset-001'
  },
  {
    id: 'weather-insights',
    name: 'Weather & Climate Insights',
    description: 'Weather patterns and climate impact analysis',
    status: 'ready',
    lastUpdated: '2024-01-15T09:15:00Z',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=mock-weather-insights',
    datasetId: 'weather-dataset-001'
  },
  {
    id: 'market-analysis',
    name: 'Market Price Analysis',
    description: 'Commodity prices and market trend analysis',
    status: 'updating',
    lastUpdated: '2024-01-15T08:45:00Z',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=mock-market-analysis',
    datasetId: 'market-dataset-001'
  }
];

export function PowerBIReports() {
  const [activeReport, setActiveReport] = useState(mockReports[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshReport = async (reportId: string) => {
    setIsRefreshing(true);
    
    // Mock refresh API call
    // In production: await refreshPowerBIReport(reportId);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'default';
      case 'updating': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Power BI Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Business intelligence reports and data visualizations (Mock Integration)
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Report Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>Select a report to view</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockReports.map((report) => (
                    <Button
                      key={report.id}
                      variant={activeReport.id === report.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveReport(report)}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{report.name}</p>
                          <Badge variant={getStatusColor(report.status)} className="text-xs">
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          {report.description}
                        </p>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Report Viewer */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {activeReport.name}
                      </CardTitle>
                      <CardDescription>{activeReport.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefreshReport(activeReport.id)}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open in Power BI
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mock Power BI Embed Container */}
                  <div className="w-full h-96 bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Power BI Report Embed</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Mock Power BI dashboard placeholder
                      </p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p>Report ID: {activeReport.id}</p>
                        <p>Dataset: {activeReport.datasetId}</p>
                        <p>Last Updated: {new Date(activeReport.lastUpdated).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Commented Power BI Integration Code */}
                  <div className="mt-4 p-4 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium mb-2">Integration Code (Ready for Production):</p>
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
{`// Power BI Embed Component (Commented for MVP)
/*
import { PowerBIEmbed } from 'powerbi-client-react';

const powerbiConfig = {
  type: 'report',
  id: '${activeReport.id}',
  embedUrl: '${activeReport.embedUrl}',
  accessToken: process.env.POWERBI_ACCESS_TOKEN,
  tokenType: models.TokenType.Embed,
  settings: {
    panes: {
      filters: { expanded: false, visible: true },
      pageNavigation: { visible: true }
    }
  }
};

<PowerBIEmbed
  embedConfig={powerbiConfig}
  eventHandlers={eventHandlers}
  cssClassName="report-container"
/>
*/`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Power BI Datasets</CardTitle>
              <CardDescription>Mock dataset management interface</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.datasetId} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{report.datasetId}</p>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Connected</Badge>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Push Data
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Power BI Configuration</CardTitle>
              <CardDescription>Integration settings and credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace ID</label>
                <div className="p-2 bg-muted rounded border text-sm">
                  workspace-12345-abcde-fghij (Mock)
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">App ID</label>
                <div className="p-2 bg-muted rounded border text-sm">
                  app-67890-klmno-pqrst (Mock)
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tenant ID</label>
                <div className="p-2 bg-muted rounded border text-sm">
                  tenant-uvwxy-z1234-56789 (Mock)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Status */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">Power BI Integration Status</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This is a mock implementation. For production integration:
                <br />• Configure Azure AD app with Power BI API permissions
                <br />• Set up service principal authentication
                <br />• Implement powerbi-client-react embedding
                <br />• Configure dataset refresh schedules
                <br />• Set up real-time data push endpoints
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}