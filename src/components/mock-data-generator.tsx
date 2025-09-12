import { punjabDistricts } from './filter-provider';

// Generate mock data that can be filtered by district and time
export interface FarmerData {
  id: string;
  name: string;
  district: string;
  date: Date;
  cropType: string;
  yield: number;
  soilHealth: number;
  queries: number;
  advisoriesReceived: number;
}

export interface AlertData {
  id: string;
  district: string;
  date: Date;
  type: 'weather' | 'pest' | 'disease' | 'price';
  severity: 'low' | 'medium' | 'high';
  message: string;
  affected: number;
}

export interface SoilData {
  district: string;
  date: Date;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  healthScore: number;
}

// Generate farmer names in Hindi and English
const farmerNamesHindi = [
  'राम सिंह', 'श्याम लाल', 'गुरदेव सिंह', 'हरजीत कौर', 'मनप्रीत सिंह',
  'जसबीर कौर', 'सुखविंदर सिंह', 'करमजीत कौर', 'बलवीर सिंह', 'रमणदीप कौर',
  'हरिंदर सिंह', 'सुरिंदर कौर', 'जगदीश सिंह', 'अमरजीत कौर', 'पारमजीत सिंह'
];

const farmerNamesEnglish = [
  'Ram Singh', 'Shyam Lal', 'Gurdev Singh', 'Harjeet Kaur', 'Manpreet Singh',
  'Jasbir Kaur', 'Sukhvinder Singh', 'Karamjit Kaur', 'Balvir Singh', 'Ramandeep Kaur',
  'Harinder Singh', 'Surinder Kaur', 'Jagdish Singh', 'Amarjit Kaur', 'Parmjit Singh'
];

const cropTypes = {
  hi: ['धान', 'गेहूं', 'कपास', 'गन्ना', 'मक्का'],
  en: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize']
};

// Generate mock farmer data
export function generateFarmerData(language: 'hi' | 'en' = 'en'): FarmerData[] {
  const data: FarmerData[] = [];
  const farmerNames = language === 'hi' ? farmerNamesHindi : farmerNamesEnglish;
  const crops = cropTypes[language];
  
  // Generate data for each district and each month of 2024
  punjabDistricts.slice(1).forEach((district, districtIndex) => { // Skip "All Districts"
    for (let month = 0; month < 12; month++) {
      for (let farmer = 0; farmer < 15; farmer++) { // 15 farmers per district per month
        const date = new Date(2024, month, Math.floor(Math.random() * 28) + 1);
        
        data.push({
          id: `farmer-${districtIndex}-${month}-${farmer}`,
          name: farmerNames[farmer % farmerNames.length],
          district: district,
          date: date,
          cropType: crops[Math.floor(Math.random() * crops.length)],
          yield: 15 + Math.random() * 25, // 15-40 quintals per hectare
          soilHealth: 60 + Math.random() * 35, // 60-95 health score
          queries: Math.floor(Math.random() * 10) + 1, // 1-10 queries
          advisoriesReceived: Math.floor(Math.random() * 5) + 1, // 1-5 advisories
        });
      }
    }
  });
  
  return data;
}

// Generate mock alert data
export function generateAlertData(language: 'hi' | 'en' = 'en'): AlertData[] {
  const data: AlertData[] = [];
  const alertTypes: Array<'weather' | 'pest' | 'disease' | 'price'> = ['weather', 'pest', 'disease', 'price'];
  const severities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  
  const messages = {
    hi: {
      weather: 'भारी बारिश की चेतावनी - फसल की सुरक्षा करें',
      pest: 'कीट प्रकोप की संभावना - निगरानी बढ़ाएं',
      disease: 'फसल में बीमारी के लक्षण दिखे',
      price: 'बाजार भाव में गिरावट का अनुमान'
    },
    en: {
      weather: 'Heavy rainfall warning - protect crops',
      pest: 'Pest outbreak possibility - increase monitoring',
      disease: 'Disease symptoms observed in crops',
      price: 'Market price decline expected'
    }
  };
  
  punjabDistricts.slice(1).forEach((district, districtIndex) => {
    for (let month = 0; month < 12; month++) {
      for (let alert = 0; alert < 3; alert++) { // 3 alerts per district per month
        const date = new Date(2024, month, Math.floor(Math.random() * 28) + 1);
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        data.push({
          id: `alert-${districtIndex}-${month}-${alert}`,
          district: district,
          date: date,
          type: type,
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: messages[language][type],
          affected: Math.floor(Math.random() * 500) + 50, // 50-550 farmers affected
        });
      }
    }
  });
  
  return data;
}

// Generate mock soil data
export function generateSoilData(): SoilData[] {
  const data: SoilData[] = [];
  
  punjabDistricts.slice(1).forEach((district) => {
    for (let month = 0; month < 12; month++) {
      const date = new Date(2024, month, 15); // Mid-month reading
      
      const ph = 6.5 + Math.random() * 1.5; // 6.5-8.0 pH
      const nitrogen = 200 + Math.random() * 100; // 200-300 kg/ha
      const phosphorus = 15 + Math.random() * 15; // 15-30 kg/ha
      const potassium = 120 + Math.random() * 80; // 120-200 kg/ha
      const organicMatter = 0.8 + Math.random() * 0.7; // 0.8-1.5%
      
      // Calculate health score based on optimal ranges
      const phScore = Math.max(0, 100 - Math.abs(ph - 7.0) * 20);
      const nScore = Math.min(100, (nitrogen / 250) * 100);
      const pScore = Math.min(100, (phosphorus / 25) * 100);
      const kScore = Math.min(100, (potassium / 160) * 100);
      const omScore = Math.min(100, (organicMatter / 1.2) * 100);
      
      const healthScore = (phScore + nScore + pScore + kScore + omScore) / 5;
      
      data.push({
        district: district,
        date: date,
        ph: Number(ph.toFixed(1)),
        nitrogen: Number(nitrogen.toFixed(1)),
        phosphorus: Number(phosphorus.toFixed(1)),
        potassium: Number(potassium.toFixed(1)),
        organicMatter: Number(organicMatter.toFixed(2)),
        healthScore: Number(healthScore.toFixed(1)),
      });
    }
  });
  
  return data;
}

// Data filtering functions
export function filterDataByDistrict<T extends { district: string }>(
  data: T[], 
  selectedDistrict: string
): T[] {
  if (selectedDistrict === 'All Districts') {
    return data;
  }
  return data.filter(item => item.district === selectedDistrict);
}

export function filterDataByTimeRange<T extends { date: Date }>(
  data: T[], 
  startDate: Date, 
  endDate: Date
): T[] {
  return data.filter(item => 
    item.date >= startDate && item.date <= endDate
  );
}

// Combined filter function
export function filterData<T extends { district: string; date: Date }>(
  data: T[],
  selectedDistrict: string,
  startDate: Date,
  endDate: Date
): T[] {
  let filtered = filterDataByDistrict(data, selectedDistrict);
  filtered = filterDataByTimeRange(filtered, startDate, endDate);
  return filtered;
}