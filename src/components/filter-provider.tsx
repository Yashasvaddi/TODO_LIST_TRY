import React, { createContext, useContext, useState, ReactNode } from 'react';

// Punjab districts data
export const punjabDistricts = [
  'All Districts',
  'Amritsar',
  'Barnala',
  'Bathinda',
  'Faridkot',
  'Fatehgarh Sahib',
  'Fazilka',
  'Ferozepur',
  'Gurdaspur',
  'Hoshiarpur',
  'Jalandhar',
  'Kapurthala',
  'Ludhiana',
  'Mansa',
  'Moga',
  'Mohali',
  'Muktsar',
  'Pathankot',
  'Patiala',
  'Rupnagar',
  'Sangrur',
  'Shaheed Bhagat Singh Nagar',
  'Tarn Taran',
];

export const punjabDistrictsHindi = [
  'सभी जिले',
  'अमृतसर',
  'बरनाला',
  'भटिंडा',
  'फरीदकोट',
  'फतेहगढ़ साहिब',
  'फाजिल्का',
  'फिरोजपुर',
  'गुरदासपुर',
  'होशियारपुर',
  'जालंधर',
  'कपूरथला',
  'लुधियाना',
  'मानसा',
  'मोगा',
  'मोहाली',
  'मुक्तसर',
  'पठानकोट',
  'पटियाला',
  'रूपनगर',
  'संगरूर',
  'शहीद भगत सिंह नगर',
  'तरन तारन',
];

export interface TimeRange {
  start: Date;
  end: Date;
  label: string;
}

export const timeRanges: TimeRange[] = [
  {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31'),
    label: '2024',
  },
  {
    start: new Date('2024-04-01'),
    end: new Date('2024-09-30'),
    label: 'Kharif 2024',
  },
  {
    start: new Date('2024-10-01'),
    end: new Date('2025-03-31'),
    label: 'Rabi 2024-25',
  },
  {
    start: new Date('2024-01-01'),
    end: new Date('2024-03-31'),
    label: 'Q1 2024',
  },
  {
    start: new Date('2024-04-01'),
    end: new Date('2024-06-30'),
    label: 'Q2 2024',
  },
  {
    start: new Date('2024-07-01'),
    end: new Date('2024-09-30'),
    label: 'Q3 2024',
  },
];

export const timeRangesHindi: TimeRange[] = [
  {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31'),
    label: '२०२४',
  },
  {
    start: new Date('2024-04-01'),
    end: new Date('2024-09-30'),
    label: 'खरीफ २०२४',
  },
  {
    start: new Date('2024-10-01'),
    end: new Date('2025-03-31'),
    label: 'रबी २०२४-२५',
  },
  {
    start: new Date('2024-01-01'),
    end: new Date('2024-03-31'),
    label: 'तिमाही १ २०२४',
  },
  {
    start: new Date('2024-04-01'),
    end: new Date('2024-06-30'),
    label: 'तिमाही २ २०२४',
  },
  {
    start: new Date('2024-07-01'),
    end: new Date('2024-09-30'),
    label: 'तिमाही ३ २०२४',
  },
];

interface FilterContextType {
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (timeRange: TimeRange) => void;
  customTimeRange: { start: Date; end: Date } | null;
  setCustomTimeRange: (range: { start: Date; end: Date } | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0]);
  const [customTimeRange, setCustomTimeRange] = useState<{ start: Date; end: Date } | null>(null);

  const contextValue: FilterContextType = {
    selectedDistrict,
    setSelectedDistrict,
    selectedTimeRange,
    setSelectedTimeRange,
    customTimeRange,
    setCustomTimeRange,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}