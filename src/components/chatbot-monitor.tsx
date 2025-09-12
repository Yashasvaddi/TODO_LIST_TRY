import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Users, Clock, TrendingUp, Languages, Smartphone, Mic, Image } from 'lucide-react';

// Mock data for chatbot analytics
const dailyQueries = [
  { date: '1 जन', queries: 1200, resolved: 1080, avgTime: 2.3 },
  { date: '2 जन', queries: 1450, resolved: 1305, avgTime: 2.1 },
  { date: '3 जन', queries: 1680, resolved: 1478, avgTime: 2.5 },
  { date: '4 जन', queries: 1920, resolved: 1728, avgTime: 2.2 },
  { date: '5 जन', queries: 2100, resolved: 1890, avgTime: 2.4 },
  { date: '6 जन', queries: 1980, resolved: 1782, avgTime: 2.3 },
  { date: '7 जन', queries: 2240, resolved: 2016, avgTime: 2.1 },
];

const languageDistribution = [
  { language: 'हिंदी', queries: 45, color: '#22c55e' },
  { language: 'English', queries: 25, color: '#3b82f6' },
  { language: 'বাংলা', queries: 12, color: '#f59e0b' },
  { language: 'தமிழ்', queries: 8, color: '#ef4444' },
  { language: 'తెలుగు', queries: 6, color: '#8b5cf6' },
  { language: 'Others', queries: 4, color: '#6b7280' },
];

const queryCategories = [
  { category: 'फसल चयन', count: 3200, percentage: 28 },
  { category: 'मौसम सलाह', count: 2800, percentage: 24 },
  { category: 'कीट नियंत्रण', count: 2100, percentage: 18 },
  { category: 'उर्वरक सुझाव', count: 1900, percentage: 16 },
  { category: 'बाजार मूल्य', count: 1600, percentage: 14 },
];

const platformUsage = [
  { platform: 'WhatsApp Bot', users: 125000, percentage: 65 },
  { platform: 'Mobile App', users: 45000, percentage: 23 },
  { platform: 'Web Portal', users: 18000, percentage: 9 },
  { platform: 'Voice Calls', users: 6000, percentage: 3 },
];

const voiceInteractions = [
  { state: 'उत्तर प्रदेश', voiceQueries: 2800, textQueries: 8200 },
  { state: 'बिहार', voiceQueries: 3200, textQueries: 6800 },
  { state: 'झारखंड', voiceQueries: 1800, textQueries: 4200 },
  { state: 'छत्तीसगढ़', voiceQueries: 1400, textQueries: 3600 },
  { state: 'ओडिशा', voiceQueries: 1200, textQueries: 2800 },
];

export function ChatbotMonitor() {
  const [selectedState, setSelectedState] = useState('सभी राज्य');
  const [selectedLanguage, setSelectedLanguage] = useState('सभी भाषाएं');

  return (
    <div className="space-y-6">
      <div>
        <h1>AI चैटबॉट निगरानी प्रणाली</h1>
        <p className="text-muted-foreground">
          किसान मित्र AI असिस्टेंट - बहुभाषी कृषि सलाहकार सेवा का प्रदर्शन विश्लेषण
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">दैनिक प्रश्न</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,240</div>
            <p className="text-xs text-muted-foreground">+12% से कल</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">समाधान दर</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92.3%</div>
            <p className="text-xs text-muted-foreground">AI द्वारा हल</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">औसत समय</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.2 सेकंड</div>
            <p className="text-xs text-muted-foreground">प्रति प्रश्न</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">सक्रिय उपयोगकर्ता</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.94 लाख</div>
            <p className="text-xs text-muted-foreground">इस सप्ताह</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">वॉइस क्वेरीज</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground">कुल में से</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">विश्लेषण</TabsTrigger>
          <TabsTrigger value="languages">भाषाएं</TabsTrigger>
          <TabsTrigger value="voice">वॉइस सपोर्ट</TabsTrigger>
          <TabsTrigger value="platforms">प्लेटफॉर्म</TabsTrigger>
          <TabsTrigger value="performance">प्रदर्शन</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Query Trend */}
          <Card>
            <CardHeader>
              <CardTitle>दैनिक प्रश्न ट्रेंड</CardTitle>
              <CardDescription>
                पिछले 7 दिनों में चैटबॉट उपयोग पैटर्न
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyQueries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="queries" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="कुल प्रश्न"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="हल किए गए"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Query Categories */}
          <Card>
            <CardHeader>
              <CardTitle>प्रश्न श्रेणियां</CardTitle>
              <CardDescription>
                सबसे अधिक पूछे जाने वाले विषय
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queryCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-chart-1 rounded-full" />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {category.count.toLocaleString('hi-IN')}
                      </span>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-chart-1 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-6">
          {/* Language Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>भाषावार वितरण</CardTitle>
                <CardDescription>
                  विभिन्न भाषाओं में प्रश्नों का प्रतिशत
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={languageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="queries"
                      label={({ language, queries }) => `${language}: ${queries}%`}
                    >
                      {languageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>भाषा सटीकता</CardTitle>
                <CardDescription>
                  विभिन्न भाषाओं में AI की समझ दर
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { lang: 'हिंदी', accuracy: 96 },
                  { lang: 'English', accuracy: 98 },
                  { lang: 'বাংলা', accuracy: 94 },
                  { lang: 'தமிழ்', accuracy: 92 },
                  { lang: 'తెలుగు', accuracy: 90 },
                  { lang: 'मराठी', accuracy: 93 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{item.lang}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {item.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Regional Language Adoption */}
          <Card>
            <CardHeader>
              <CardTitle>क्षेत्रीय भाषा अपनाना</CardTitle>
              <CardDescription>
                राज्यवार स्थानीय भाषा उपयोग का ट्रेंड
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-5 w-5 text-green-600" />
                    <span className="font-medium">उत्तर भारत</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    हिंदी: 78% | पंजाबी: 12% | उर्दू: 10%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">दक्षिण भारत</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    तमिल: 35% | तेलुगु: 30% | कन्नड़: 25% | मलयालम: 10%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">पूर्व भारत</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    बंगाली: 65% | हिंदी: 25% | ओड़िया: 10%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          {/* Voice Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>आवाज़ आधारित इंटरैक्शन</CardTitle>
              <CardDescription>
                राज्यवार वॉइस और टेक्स्ट क्वेरीज का अनुपात
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={voiceInteractions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="voiceQueries" stackId="a" fill="hsl(var(--chart-1))" name="वॉइस" />
                  <Bar dataKey="textQueries" stackId="a" fill="hsl(var(--chart-2))" name="टेक्स्ट" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Voice Recognition Accuracy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>वॉइस पहचान सटीकता</CardTitle>
                <CardDescription>
                  विभिन्न बोलियों में ऑडियो समझ दर
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { dialect: 'मानक हिंदी', accuracy: 95 },
                  { dialect: 'देवनागरी (UP)', accuracy: 92 },
                  { dialect: 'हरियाणवी', accuracy: 88 },
                  { dialect: 'राजस्थानी', accuracy: 85 },
                  { dialect: 'भोजपुरी', accuracy: 82 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{item.dialect}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {item.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>कम साक्षरता वाले क्षेत्र</CardTitle>
                <CardDescription>
                  वॉइस सपोर्ट का विशेष प्रभाव
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Mic className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">बिहार</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      65% किसान वॉइस इंटरफेस पसंद करते हैं
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Mic className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">झारखंड</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      72% वॉइस उपयोग, मुख्यतः आदिवासी क्षेत्रों में
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Mic className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">छत्तीसगढ़</span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      58% वॉइस क्वेरीज, स्थानीय बोली समर्थन
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {/* Platform Usage */}
          <Card>
            <CardHeader>
              <CardTitle>प्लेटफॉर्म उपयोग वितरण</CardTitle>
              <CardDescription>
                विभिन्न चैनलों पर उपयोगकर्ता की संख्या
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformUsage.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {platform.users.toLocaleString('hi-IN')} उपयोगकर्ता
                      </span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-chart-1 h-2 rounded-full" 
                          style={{ width: `${platform.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {platform.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Bot Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>व्हाट्सएप बॉट</CardTitle>
                <CardDescription>सबसे लोकप्रिय प्लेटफॉर्म</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>सक्रिय उपयोगकर्ता</span>
                    <span className="font-bold">1,25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>दैनिक संदेश</span>
                    <span className="font-bold">15,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>प्रतिक्रिया समय</span>
                    <span className="font-bold">1.8 सेकंड</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>मोबाइल ऐप</CardTitle>
                <CardDescription>किसान मित्र ऐप</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>डाउनलोड</span>
                    <span className="font-bold">45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>दैनिक सक्रिय</span>
                    <span className="font-bold">8,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>औसत सत्र</span>
                    <span className="font-bold">12 मिनट</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>कॉल सेंटर</CardTitle>
                <CardDescription>टोल-फ्री हेल्पलाइन</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>दैनिक कॉल</span>
                    <span className="font-bold">1,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>समाधान दर</span>
                    <span className="font-bold">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>प्रतीक्षा समय</span>
                    <span className="font-bold">45 सेकंड</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* AI Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle>AI मॉडल प्रदर्शन</CardTitle>
              <CardDescription>
                विभिन्न कृषि विषयों में सटीकता दर
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { topic: 'फसल रोग पहचान', accuracy: 94 },
                { topic: 'मौसम आधारित सलाह', accuracy: 96 },
                { topic: 'उर्वरक सुझाव', accuracy: 91 },
                { topic: 'कीट नियंत्रण', accuracy: 89 },
                { topic: 'बाजार मूल्य', accuracy: 98 },
                { topic: 'सरकारी योजना', accuracy: 92 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{item.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">
                      {item.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>सिस्टम स्वास्थ्य</CardTitle>
                <CardDescription>तकनीकी प्रदर्शन मेट्रिक्स</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>अपटाइम</span>
                  <Badge variant="default">99.8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>API लेटेंसी</span>
                  <Badge variant="default">120ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>एरर रेट</span>
                  <Badge variant="default">0.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>डेटाबेस स्वास्थ्य</span>
                  <Badge variant="default">अच्छा</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>उपयोगकर्ता संतुष्टि</CardTitle>
                <CardDescription>फीडबैक और रेटिंग</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>औसत रेटिंग</span>
                  <Badge variant="default">4.6/5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>सकारात्मक फीडबैक</span>
                  <Badge variant="default">87%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>दोबारा उपयोग</span>
                  <Badge variant="default">92%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>सुधार सुझाव</span>
                  <Badge variant="secondary">340</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}