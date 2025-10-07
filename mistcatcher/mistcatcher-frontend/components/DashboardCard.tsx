
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  unit?: string;
  children?: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, unit, children, className }) => {
  return (
    <div className={`bg-brand-card p-6 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-sm font-medium text-brand-text-medium uppercase tracking-wider">{title}</h3>
      <div className="mt-1">
        <span className="text-3xl font-semibold text-brand-text-light">{value}</span>
        {unit && <span className="ml-1 text-xl text-brand-text-medium">{unit}</span>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default DashboardCard;
