
import React from 'react';

export interface NavItemType {
  name: string;
  path: string;
  icon?: React.ReactNode; 
}

export interface OverviewMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface ProgressMetric {
  label: string;
  currentValue: number;
  maxValue: number;
  unit: string;
  percentage?: number; // Optional, can be derived or direct
}

export interface HistoricalDataPoint {
  name: string; // e.g., 'Mon', 'Tue', 'Jan', 'Feb'
  temperature?: number;
  humidity?: number;
  water?: number;
}

export enum TimeRange {
  LAST_24_HOURS = "Ultimas 24 horas",
  LAST_7_DAYS = "Ultimos 7 días",
  LAST_MONTH = "Mes pasado",
  CUSTOM = "Rango personalizado",
}

export interface ChartCardProps {
  title: string;
  currentValue: string;
  changePeriod: string;
  changePercentage: number; // Positive for increase, negative for decrease
  data: HistoricalDataPoint[];
  dataKey: keyof HistoricalDataPoint;
  chartType: 'line' | 'bar';
  color: string;
}

export interface SavingsCardData {
  title: string;
  value: string;
  percentageChange: string;
  positive: boolean;
}
