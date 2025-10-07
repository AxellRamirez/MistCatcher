
import React, { useState } from 'react';
import { TimeRange } from '../types';

interface TimeRangeSelectorProps {
  onSelectRange: (range: TimeRange) => void;
  defaultRange?: TimeRange;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ onSelectRange, defaultRange = TimeRange.LAST_7_DAYS }) => {
  const [activeRange, setActiveRange] = useState<TimeRange>(defaultRange);

  const ranges: TimeRange[] = [
    TimeRange.LAST_24_HOURS,
    TimeRange.LAST_7_DAYS,
    TimeRange.LAST_MONTH,
    TimeRange.CUSTOM,
  ];

  const handleSelect = (range: TimeRange) => {
    setActiveRange(range);
    onSelectRange(range);
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-brand-card rounded-md mb-6">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => handleSelect(range)}
          className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium rounded-md transition-colors
            ${activeRange === range 
              ? 'bg-brand-accent text-white' 
              : 'bg-slate-700 text-brand-text-medium hover:bg-slate-600 hover:text-brand-text-light'
            }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
