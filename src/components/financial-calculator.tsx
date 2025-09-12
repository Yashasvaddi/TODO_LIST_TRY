import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calculator, TrendingUp, PiggyBank, FileText, IndianRupee, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Mock data for financial planning
const cropCostData = [
  { crop: 'धान', area: 1, seeds: 2500, fertilizer: 8000, pesticide: 3000, labor: 12000, machinery: 5000, irrigation: 2000, total: 32500 },
  { crop: 'गेहूं', area: 1, seeds: 3000, fertilizer: 7500, pesticide: 2500, labor: 10000, machinery: 4500, irrigation: 1800, total: 29300 },
  { crop: 'मक्का', area: 1, seeds: 2800, fertilizer: 6500, pesticide: 2800, labor: 9500, machinery: 4000, irrigation: 2200, total: 27800 },
  { crop: 'सोयाबीन', area: 1, seeds: 4000, fertilizer: 5500, pesticide: 3500, labor: 8000, machinery: 3500, irrigation: 1500, total: 26000 },
];

const governmentSchemes = [
  {
    name: 'प्रधानमंत्री किसान सम्मान निधि',
    amount: 6000,
    frequency: 'वार्षिक',
    eligibility: 'सभी किसान परिवार',
    status: 'सक्रिय'
  },
  {
    name: 'किसान क्रेडिट कार्ड',
    amount: 300000,
    frequency: 'ऋण सीमा',
    eligibility: 'भूमिधारी किसान',
    status: 'सक्रिय'
  },
  {
    name: 'प्रधानमंत्री फसल बीमा योजना',
    amount: 200000,
    frequency: 'प्रति हेक्टेयर',
    eligibility: 'सभी किसान',
    status: 'सक्रिय'
  },
  {
    name: 'मुख्यमंत्री किसान कल्याण योजना (MP)',
    amount: 4000,
    frequency: 'वार्षिक',
    eligibility: 'मध्य प्रदेश के किसान',
    status: 'सक्रिय'
  }
];

const loanOptions = [
  { bank: 'भारतीय स्टेट बैंक', rate: 7.0, maxAmount: 500000, processing: 0.5 },
  { bank: 'पंजाब नेशनल बैंक', rate: 7.25, maxAmount: 400000, processing: 0.25 },
  { bank: 'बैंक ऑफ बड़ौदा', rate: 7.15, maxAmount: 450000, processing: 0.35 },
  { bank: 'केनरा बैंक', rate: 7.30, maxAmount: 350000, processing: 0.40 },
];

export function FinancialCalculator() {
  const [selectedCrop, setSelectedCrop] = useState('धान');
  const [farmArea, setFarmArea] = useState(1);
  const [expectedYield, setExpectedYield] = useState(25);
  const [marketPrice, setMarketPrice] = useState(2000);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanTenure, setLoanTenure] = useState(3);

  const selectedCropData = cropCostData.find(crop => crop.crop === selectedCrop) || cropCostData[0];
  
  const totalCost = selectedCropData.total * farmArea;
  const expectedRevenue = expectedYield * marketPrice * farmArea;
  const expectedProfit = expectedRevenue - totalCost;
  const profitMargin = totalCost > 0 ? (expectedProfit / expectedRevenue) * 100 : 0;

  const costBreakdown = [
    { name: 'बीज', value: selectedCropData.seeds, color: '#22c55e' },
    { name: 'उर्वरक', value: selectedCropData.fertilizer, color: '#3b82f6' },
    { name: 'कीटनाशक', value: selectedCropData.pesticide, color: '#f59e0b' },
    { name: 'श्रम', value: selectedCropData.labor, color: '#ef4444' },
    { name: 'मशीनरी', value: selectedCropData.machinery, color: '#8b5cf6' },
    { name: 'सिंचाई', value: selectedCropData.irrigation, color: '#06b6d4' },
  ];

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                 (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>कृषि वित्तीय कैलकुलेटर</h1>
        <p className="text-muted-foreground">
          फसल लागत, लाभ अनुमान और सरकारी योजनाओं का वित्तीय विश्लेषण
        </p>
      </div>

      <Tabs defaultValue="cost-calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cost-calculator">लागत कैलकुलेटर</TabsTrigger>
          <TabsTrigger value="loan-calculator">ऋण कैलकुलेटर</TabsTrigger>
          <TabsTrigger value="schemes">सरकारी योजनाएं</TabsTrigger>
          <TabsTrigger value="planning">वित्तीय योजना</TabsTrigger>
        </TabsList>

        <TabsContent value="cost-calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  फसल विवरण
                </CardTitle>
                <CardDescription>
                  अपनी फसल की जानकारी दर्ज करें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crop">फसल चुनें</Label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cropCostData.map(crop => (
                        <SelectItem key={crop.crop} value={crop.crop}>
                          {crop.crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">खेत का क्षेत्रफल (हेक्टेयर)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={farmArea}
                    onChange={(e) => setFarmArea(parseFloat(e.target.value) || 1)}
                    placeholder="1.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yield">अपेक्षित उत्पादन (क्विंटल/हेक्टेयर)</Label>
                  <Input
                    id="yield"
                    type="number"
                    value={expectedYield}
                    onChange={(e) => setExpectedYield(parseFloat(e.target.value) || 25)}
                    placeholder="25"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">बाजार मूल्य (₹/क्विंटल)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(parseFloat(e.target.value) || 2000)}
                    placeholder="2000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>वित्तीय विश्लेषण</CardTitle>
                <CardDescription>
                  {selectedCrop} की खेती के लिए लागत और लाभ का अनुमान
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">कुल लागत</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{totalCost.toLocaleString('hi-IN')}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">अपेक्षित आय</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      ₹{expectedRevenue.toLocaleString('hi-IN')}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${expectedProfit >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-medium">शुद्ध लाभ</span>
                    </div>
                    <p className={`text-xl font-bold ${expectedProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₹{expectedProfit.toLocaleString('hi-IN')}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PiggyBank className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">लाभ मार्जिन</span>
                    </div>
                    <p className="text-xl font-bold text-purple-600">
                      {profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown Chart */}
                <div className="mt-6">
                  <h3 className="font-medium mb-4">लागत वितरण</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ₹${value}`}
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loan-calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loan Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>ऋण कैलकुलेटर</CardTitle>
                <CardDescription>
                  कृषि ऋण की EMI और ब्याज गणना
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">ऋण राशि (₹)</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 100000)}
                    placeholder="100000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenure">ऋण अवधि (वर्ष)</Label>
                  <Select value={loanTenure.toString()} onValueChange={(value: string) => setLoanTenure(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 वर्ष</SelectItem>
                      <SelectItem value="2">2 वर्ष</SelectItem>
                      <SelectItem value="3">3 वर्ष</SelectItem>
                      <SelectItem value="5">5 वर्ष</SelectItem>
                      <SelectItem value="7">7 वर्ष</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6 space-y-3">
                  <h4 className="font-medium">बैंक विकल्प</h4>
                  {loanOptions.map((bank, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{bank.bank}</span>
                        <Badge variant="outline">{bank.rate}% ब्याज</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span>EMI: ₹{calculateEMI(loanAmount, bank.rate, loanTenure).toLocaleString('hi-IN')}</span>
                        <span>अधिकतम: ₹{bank.maxAmount.toLocaleString('hi-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* KCC Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>किसान क्रेडिट कार्ड (KCC)</CardTitle>
                <CardDescription>
                  KCC के लाभ और पात्रता मानदंड
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">मुख्य लाभ</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• 7% तक कम ब्याज दर</li>
                      <li>• 3 लाख तक बिना गारंटी</li>
                      <li>• 2% ब्याज सब्सिडी</li>
                      <li>• फसल बीमा कवर</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">पात्रता</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• भूमिधारी किसान</li>
                      <li>• काश्तकार किसान</li>
                      <li>• स्वयं सहायता समूह सदस्य</li>
                      <li>• मछली पालन करने वाले</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">आवश्यक दस्तावेज</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• भूमि के कागजात</li>
                      <li>• पहचान प्रमाण</li>
                      <li>• पता प्रमाण</li>
                      <li>• पासपोर्ट साइज फोटो</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schemes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>सरकारी योजनाएं</CardTitle>
              <CardDescription>
                किसानों के लिए उपलब्ध सरकारी सहायता योजनाएं
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {governmentSchemes.map((scheme, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{scheme.name}</h3>
                      <Badge variant={scheme.status === 'सक्रिय' ? 'default' : 'secondary'}>
                        {scheme.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">राशि:</span>
                        <span className="font-medium">₹{scheme.amount.toLocaleString('hi-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">आवृत्ति:</span>
                        <span>{scheme.frequency}</span>
                      </div>
                      <div className="text-muted-foreground">
                        <span>पात्रता: </span>
                        <span>{scheme.eligibility}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card>
            <CardHeader>
              <CardTitle>आवेदन प्रक्रिया</CardTitle>
              <CardDescription>
                सरकारी योजनाओं के लिए आवेदन कैसे करें
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">1. दस्तावेज तैयार करें</h3>
                  <p className="text-sm text-muted-foreground">
                    आधार कार्ड, बैंक पासबुक, भूमि के कागजात तैयार रखें
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">2. ऑनलाइन आवेदन</h3>
                  <p className="text-sm text-muted-foreground">
                    PM-Kisan पोर्टल या CSC केंद्र पर जाकर आवेदन करें
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">3. स्थिति जांचें</h3>
                  <p className="text-sm text-muted-foreground">
                    आवेदन संख्या से अपने आवेदन की स्थिति ट्रैक करें
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>वार्षिक वित्तीय योजना</CardTitle>
              <CardDescription>
                पूरे साल की आय-व्यय की योजना बनाएं
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">रबी सीजन (अक्टूबर-मार्च)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>गेहूं (2 हेक्टेयर)</span>
                      <span className="font-medium">₹58,600</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>सरसों (0.5 हेक्टेयर)</span>
                      <span className="font-medium">₹15,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <span className="font-medium">कुल लागत</span>
                      <span className="font-bold text-green-600">₹73,600</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">खरीफ सीजन (जून-सितंबर)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>धान (2 हेक्टेयर)</span>
                      <span className="font-medium">₹65,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>दालें (0.5 हेक्टेयर)</span>
                      <span className="font-medium">₹13,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <span className="font-medium">कुल लागत</span>
                      <span className="font-bold text-blue-600">₹78,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">वार्षिक लागत</p>
                    <p className="text-xl font-bold">₹1,51,600</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">अपेक्षित आय</p>
                    <p className="text-xl font-bold text-green-600">₹2,25,000</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">शुद्ध लाभ</p>
                    <p className="text-xl font-bold text-blue-600">₹73,400</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Tips */}
          <Card>
            <CardHeader>
              <CardTitle>वित्तीय सुझाव</CardTitle>
              <CardDescription>
                बेहतर आर्थिक प्रबंधन के लिए सुझाव
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">लागत कम करने के तरीके</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                      <span>जैविक खाद का उपयोग करें</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                      <span>किसान उत्पादक संगठन से जुड़ें</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                      <span>मशीनरी साझा करें</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                      <span>सरकारी सब्सिडी का लाभ उठाएं</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">आय बढ़ाने के तरीके</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>मूल्य संवर्धन करें</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>सीधे बाजार में बेचें</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>फसल विविधीकरण करें</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>कृषि व्यवसाय शुरू करें</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}