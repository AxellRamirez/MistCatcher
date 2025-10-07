
import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartCardProps, HistoricalDataPoint } from '../types';
import { UpArrowIcon, DownArrowIcon } from '../icons';

const ChartCard: React.FC<ChartCardProps> = ({ title, currentValue, changePeriod, changePercentage, data, dataKey, chartType, color }) => {
  const ChangeIcon = changePercentage >= 0 ? UpArrowIcon : DownArrowIcon;
  const changeColor = changePercentage >= 0 ? 'text-brand-green' : 'text-brand-red';

  return (
    <div className="bg-brand-card p-4 sm:p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold text-brand-text-light">{title}</h3>
      <div className="flex items-baseline mt-1 mb-2">
        <p className="text-3xl font-bold text-brand-text-light">{currentValue}</p>
      </div>
      <div className="flex items-center text-xs text-brand-text-medium mb-4">
        <span>{changePeriod}</span>
        <ChangeIcon className={`w-3 h-3 ml-1 ${changeColor}`} />
        <span className={`ml-0.5 ${changeColor}`}>{Math.abs(changePercentage)}%</span>
      </div>
      <div className="flex-grow min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#4A5568" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#E2E8F0' }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Line type="monotone" dataKey={dataKey as string} stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#4A5568" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#E2E8F0' }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Bar dataKey={dataKey as string} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
