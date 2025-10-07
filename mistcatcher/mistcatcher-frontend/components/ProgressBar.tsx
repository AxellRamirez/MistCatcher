
import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number; // 0 to 100
  valueText?: string; // e.g., "1500 ml / 2500 ml"
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage, valueText }) => {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="my-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-brand-text-light">{label}</span>
        {valueText && <span className="text-xs text-brand-text-medium">{valueText}</span>}
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-brand-accent h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
