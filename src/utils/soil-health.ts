export interface SoilNutrient extends Record<string, number> {
  high: number;
  medium: number;
  low: number;
}

export interface SoilpH extends Record<string, number> {
  acidic: number;
  neutral: number;
  alkaline: number;
}

export interface SoilHealthData {
  address: string;
  region: string;
  crops: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  soilMetrics: {
    nitrogen: SoilNutrient;
    phosphorous: SoilNutrient;
    potassium: SoilNutrient;
    ph: SoilpH;
  };
}

// Helper functions
const parsePercentage = (value: string): number => {
  try {
    if (!value || typeof value !== 'string') return 0;
    const cleanValue = value.replace(/%/g, '').trim();
    const number = parseFloat(cleanValue) / 100;
    return isNaN(number) ? 0 : Math.max(0, Math.min(1, number));
  } catch {
    return 0;
  }
};

const parseCSVRow = (row: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
};

const parseNumber = (value: string): number => {
  try {
    const num = parseFloat(value.trim());
    return isNaN(num) ? 0 : num;
  } catch {
    return 0;
  }
};

const REQUIRED_HEADERS = [
  'Address',
  'Region',
  'Crop',
  'Latitude',
  'Longitude',
  'Nitrogen - High',
  'Nitrogen - Medium',
  'Nitrogen - Low',
  'Phosphorous - High',
  'Phosphorous - Medium',
  'Phosphorous - Low',
  'Potassium - High',
  'Potassium - Medium',
  'Potassium - Low',
  'pH - Acidic',
  'pH - Neutral',
  'pH - Alkaline'
] as const;

const validatePercentages = (nutrient: SoilNutrient | SoilpH): boolean => {
  const sum = Object.values(nutrient).reduce((a, b) => a + b, 0);
  const TOLERANCE = 0.3; // Allow up to 30% deviation due to rounding in source data
  return Math.abs(sum - 1) < TOLERANCE;
};

const normalizePercentages = (nutrient: SoilNutrient | SoilpH): void => {
  const sum = Object.values(nutrient).reduce((a, b) => a + b, 0);
  if (sum === 0) return; // Avoid division by zero
  
  // Normalize each value so they sum to 1
  const keys = Object.keys(nutrient) as (keyof typeof nutrient)[];
  keys.forEach(key => {
    nutrient[key] = nutrient[key] / sum;
  });
};

/**
 * Parses CSV soil health data into structured SoilHealthData objects
 * @param csvData Raw CSV string data
 * @returns Array of parsed SoilHealthData objects
 */
export const parseSoilHealthData = (csvData: string): SoilHealthData[] => {
  try {
    // Initial data validation
    if (!csvData || typeof csvData !== 'string') {
      console.error('Invalid CSV data received:', typeof csvData);
      return [];
    }

    // Clean and normalize the CSV data
    const cleanCsv = csvData
      .replace(/^\uFEFF/, '') // Remove BOM if present
      .replace(/\r\n|\r|\n/g, '\n') // Normalize line endings
      .trim();
    
    // Split into rows
    const rows = cleanCsv.split('\n')
      .map(row => row.trim())
      .filter(row => row.length > 0);
    
    if (rows.length < 2) {
      console.error('CSV data has insufficient rows, found:', rows.length);
      return [];
    }

    // Parse headers and create column map
    const headerRow = parseCSVRow(rows[0]);
    const columnMap = new Map<string, number>();
    headerRow.forEach((header, index) => {
      const normalizedHeader = header.trim().toLowerCase();
      columnMap.set(normalizedHeader, index);
    });

    // Validate required headers (case-insensitive)
    const missingColumns = REQUIRED_HEADERS.filter(col => 
      !columnMap.has(col.toLowerCase())
    );

    if (missingColumns.length > 0) {
      console.error('Missing required columns:', missingColumns);
      console.log('Available columns:', headerRow);
      return [];
    }

    // Process data rows
    const soilData: SoilHealthData[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const rowValues = parseCSVRow(rows[i]);
      if (rowValues.length !== headerRow.length) {
        console.warn(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const getValue = (header: string): string => {
        const index = columnMap.get(header.toLowerCase());
        return index !== undefined ? rowValues[index] : '';
      };

      try {
        // Skip rows with missing address/region
        const address = getValue('Address').trim();
        const region = getValue('Region').trim();
        if (!address || !region) {
          console.warn(`Row ${i + 1}: Missing address or region`);
          continue;
        }

        // Parse location
        const latitude = parseNumber(getValue('Latitude'));
        const longitude = parseNumber(getValue('Longitude'));
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Row ${i + 1}: Invalid coordinates`);
          continue;
        }

        // Parse crops
        const crops = getValue('Crop')
          .split(',')
          .map(crop => crop.trim())
          .filter(crop => crop.length > 0);

        if (crops.length === 0) {
          console.warn(`Row ${i + 1}: No crops specified`);
          continue;
        }

        // Create nutrient data objects with strict percentage validation
        const nitrogen: SoilNutrient = {
          high: parsePercentage(getValue('Nitrogen - High')),
          medium: parsePercentage(getValue('Nitrogen - Medium')),
          low: parsePercentage(getValue('Nitrogen - Low'))
        };

        const phosphorous: SoilNutrient = {
          high: parsePercentage(getValue('Phosphorous - High')),
          medium: parsePercentage(getValue('Phosphorous - Medium')),
          low: parsePercentage(getValue('Phosphorous - Low'))
        };

        const potassium: SoilNutrient = {
          high: parsePercentage(getValue('Potassium - High')),
          medium: parsePercentage(getValue('Potassium - Medium')),
          low: parsePercentage(getValue('Potassium - Low'))
        };

        const ph: SoilpH = {
          acidic: parsePercentage(getValue('pH - Acidic')),
          neutral: parsePercentage(getValue('pH - Neutral')),
          alkaline: parsePercentage(getValue('pH - Alkaline'))
        };

        // Normalize percentages to ensure they sum to 100%
        normalizePercentages(nitrogen);
        normalizePercentages(phosphorous);
        normalizePercentages(potassium);
        normalizePercentages(ph);

        // Validate the normalized percentages
        if (!validatePercentages(nitrogen) || 
            !validatePercentages(phosphorous) ||
            !validatePercentages(potassium) ||
            !validatePercentages(ph)) {
          console.warn(`Row ${i + 1}: Invalid nutrient percentages after normalization`);
          continue;
        }

        // Construct the final data object
        const data: SoilHealthData = {
          address,
          region,
          crops,
          location: { latitude, longitude },
          soilMetrics: {
            nitrogen,
            phosphorous,
            potassium,
            ph
          }
        };

        soilData.push(data);
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
      }
    }

    if (soilData.length === 0) {
      throw new Error('No valid soil health records found in the data');
    }

    console.log(`Successfully parsed ${soilData.length} soil health records`);
    return soilData;
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return [];
  }
};

/**
 * Calculate regional averages of soil health data
 */
export const calculateRegionAverages = (data: SoilHealthData[]): Record<string, SoilHealthData> => {
  // Group data by region
  const regionData: Record<string, SoilHealthData[]> = {};
  data.forEach(entry => {
    if (!regionData[entry.region]) {
      regionData[entry.region] = [];
    }
    regionData[entry.region].push(entry);
  });

  // Calculate averages for each region
  const averages: Record<string, SoilHealthData> = {};
  
  Object.entries(regionData).forEach(([region, entries]) => {
    if (entries.length === 0) return;

    // Helper function to calculate average nutrient levels
    const avgNutrient = (fieldName: keyof typeof entries[0]['soilMetrics']): SoilNutrient => {
      const avg = {
        high: entries.reduce((sum, e) => sum + e.soilMetrics[fieldName].high, 0) / entries.length,
        medium: entries.reduce((sum, e) => sum + e.soilMetrics[fieldName].medium, 0) / entries.length,
        low: entries.reduce((sum, e) => sum + e.soilMetrics[fieldName].low, 0) / entries.length
      };
      normalizePercentages(avg);
      return avg;
    };

    // Calculate average pH values
    const avgPh = {
      acidic: entries.reduce((sum, e) => sum + e.soilMetrics.ph.acidic, 0) / entries.length,
      neutral: entries.reduce((sum, e) => sum + e.soilMetrics.ph.neutral, 0) / entries.length,
      alkaline: entries.reduce((sum, e) => sum + e.soilMetrics.ph.alkaline, 0) / entries.length
    };
    normalizePercentages(avgPh);

    // Get the central location for the region
    const avgLat = entries.reduce((sum, e) => sum + e.location.latitude, 0) / entries.length;
    const avgLon = entries.reduce((sum, e) => sum + e.location.longitude, 0) / entries.length;

    // Combine all crops from the region
    const allCrops = Array.from(new Set(entries.flatMap(e => e.crops)));

    averages[region] = {
      address: `Average for ${region}`,
      region: region,
      crops: allCrops,
      location: {
        latitude: avgLat,
        longitude: avgLon
      },
      soilMetrics: {
        nitrogen: avgNutrient('nitrogen'),
        phosphorous: avgNutrient('phosphorous'),
        potassium: avgNutrient('potassium'),
        ph: avgPh
      }
    };
  });

  return averages;
};

/**
 * Get a list of all unique crops across the dataset
 */
export const getAllCrops = (data: SoilHealthData[]): string[] => {
  const cropSet = new Set<string>();
  data.forEach(entry => {
    entry.crops.forEach(crop => cropSet.add(crop.trim()));
  });
  return Array.from(cropSet).sort();
};

/**
 * Get a list of all unique regions
 */
export const getRegions = (data: SoilHealthData[]): string[] => {
  return Array.from(new Set(data.map(entry => entry.region))).sort();
};

/**
 * Calculate nutrient index score (1-3 scale)
 */
export const calculateNutrientIndex = (nutrient: SoilNutrient): number => {
  return (nutrient.high * 3 + nutrient.medium * 2 + nutrient.low * 1);
};

/**
 * Generate soil health recommendations based on nutrient levels
 */
export const getSoilHealthRecommendations = (metrics: { nitrogen: SoilNutrient; phosphorous: SoilNutrient; potassium: SoilNutrient; ph: SoilpH }): string[] => {
  const recommendations: string[] = [];

  // Nitrogen recommendations
  if (metrics.nitrogen.low > 0.5) {
    recommendations.push('Consider nitrogen-fixing crops like legumes or applying nitrogen-rich fertilizers');
  } else if (metrics.nitrogen.medium > 0.5) {
    recommendations.push('Maintain current nitrogen levels through regular crop rotation');
  }

  // Phosphorous recommendations
  if (metrics.phosphorous.low > 0.5) {
    recommendations.push('Add phosphorous through rock phosphate or organic sources like bone meal');
  } else if (metrics.phosphorous.medium > 0.5) {
    recommendations.push('Monitor phosphorous levels and consider maintenance application');
  }

  // Potassium recommendations
  if (metrics.potassium.low > 0.5) {
    recommendations.push('Supplement with potassium-rich organic matter or approved minerals');
  } else if (metrics.potassium.medium > 0.5) {
    recommendations.push('Maintain potassium levels through mulching and balanced fertilization');
  }

  // pH recommendations
  if (metrics.ph.acidic > 0.4) {
    recommendations.push('Apply agricultural lime to increase soil pH');
  } else if (metrics.ph.alkaline > 0.4) {
    recommendations.push('Add organic matter or sulfur to gradually decrease soil pH');
  } else {
    recommendations.push('Maintain current pH levels through proper organic matter management');
  }

  return recommendations;
};