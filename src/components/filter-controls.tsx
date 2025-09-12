import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Card, CardContent } from './ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useFilters, punjabDistricts, punjabDistrictsHindi, timeRanges, timeRangesHindi } from './filter-provider';
import { comprehensiveTranslations } from './comprehensive-translations';

interface FilterControlsProps {
  language: 'hi' | 'en';
}

export function FilterControls({ language }: FilterControlsProps) {
  const { 
    selectedDistrict, 
    setSelectedDistrict, 
    selectedTimeRange, 
    setSelectedTimeRange,
    customTimeRange,
    setCustomTimeRange 
  } = useFilters();
  
  const t = comprehensiveTranslations[language];
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [sliderValue, setSliderValue] = useState([6]); // Default to 6 months (April 2024)
  
  const districts = language === 'hi' ? punjabDistrictsHindi : punjabDistricts;
  const timeRangeOptions = language === 'hi' ? timeRangesHindi : timeRanges;
  
  // Map slider value to months (0 = Jan 2024, 11 = Dec 2024)
  const months = language === 'hi' 
    ? ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const monthIndex = value[0];
    const startDate = new Date(2024, monthIndex, 1);
    const endDate = new Date(2024, monthIndex + 1, 0); // Last day of the month
    
    setCustomTimeRange({ start: startDate, end: endDate });
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
  };

  const handleTimeRangeChange = (value: string) => {
    const timeRange = timeRangeOptions.find(tr => tr.label === value);
    if (timeRange) {
      setSelectedTimeRange(timeRange);
      setCustomTimeRange(null);
      setShowCustomRange(false);
    }
  };

  const toggleCustomRange = () => {
    setShowCustomRange(!showCustomRange);
    if (!showCustomRange) {
      // Reset to default when showing custom range
      const monthIndex = sliderValue[0];
      const startDate = new Date(2024, monthIndex, 1);
      const endDate = new Date(2024, monthIndex + 1, 0);
      setCustomTimeRange({ start: startDate, end: endDate });
    } else {
      setCustomTimeRange(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* District Filter */}
          <div className="flex items-center space-x-2 min-w-[200px]">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.selectDistrict} />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district, index) => (
                  <SelectItem key={index} value={punjabDistricts[index]}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center space-x-2 min-w-[200px]">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedTimeRange.label} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.selectTimeRange} />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((range, index) => (
                  <SelectItem key={index} value={range.label}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Time Range Toggle */}
          <Button 
            variant={showCustomRange ? "default" : "outline"} 
            size="sm" 
            onClick={toggleCustomRange}
            className="flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>{language === 'hi' ? 'कस्टम समय' : 'Custom Time'}</span>
          </Button>
        </div>

        {/* Timeline Slider */}
        {showCustomRange && (
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'hi' ? 'समय:' : 'Time:'}</span>
                <span className="text-sm text-primary">
                  {months[sliderValue[0]]} 2024
                </span>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                max={11}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{months[0]} 2024</span>
                <span>{months[11]} 2024</span>
              </div>
            </div>
          </div>
        )}

        {/* Current Selection Display */}
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>
            <strong>{t.district}:</strong> {
              language === 'hi' 
                ? districts[punjabDistricts.indexOf(selectedDistrict)] 
                : selectedDistrict
            }
          </span>
          <span>•</span>
          <span>
            <strong>{t.timeRange}:</strong> {
              customTimeRange 
                ? `${months[sliderValue[0]]} 2024`
                : (language === 'hi' ? timeRangesHindi : timeRanges).find(tr => tr.start.getTime() === selectedTimeRange.start.getTime())?.label
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );
}