// src/pages/OverviewPage.tsx

import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
import DashboardCard from '../components/DashboardCard';
import ProgressBar from '../components/ProgressBar';
import { OverviewMetric, ProgressMetric } from '../types';

// Definir la interfaz para los datos que esperamos del backend
interface MeasurementData {
  id: number;
  temperature: string; // Vienen como string de la DB, los convertiremos a número
  humidity: string;
  water_collected: string;
  timestamp: string;
}

const OverviewPage: React.FC = () => {
  const [latestMeasurement, setLatestMeasurement] = useState<MeasurementData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener la última medición
  const fetchLatestMeasurement = async () => {
    setLoading(true);
    setError(null);
    try {
      // Realizar la petición a tu backend
      const response = await fetch('http://localhost:5000/api/latest-measurement');
      
      if (!response.ok) {
        // Si la respuesta no es OK (ej. 404, 500), lanzar un error
        if (response.status === 404) {
          throw new Error('No se encontraron mediciones. La base de datos podría estar vacía.');
        }
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      
      const data: MeasurementData = await response.json();
      setLatestMeasurement(data);
    } catch (err) {
      console.error('Error fetching latest measurement:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  // Usar useEffect para cargar los datos cuando el componente se monta
  useEffect(() => {
    fetchLatestMeasurement();
    // Opcional: Actualizar los datos cada X segundos para "tiempo real"
    const intervalId = setInterval(fetchLatestMeasurement, 15000); // Actualizar cada 15 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Prepara las métricas de la tarjeta con los datos obtenidos
  const overviewMetrics: OverviewMetric[] = latestMeasurement ? [
    { label: 'Temperatura actual', value: parseFloat(latestMeasurement.temperature).toFixed(1), unit: '°C' },
    { label: 'Humedad relativa actual', value: parseFloat(latestMeasurement.humidity).toFixed(1), unit: '%' },
    { label: 'Agua recolectada diariamente', value: parseFloat(latestMeasurement.water_collected).toFixed(1), unit: 'ml' },
  ] : [
    { label: 'Temperatura actual', value: '--', unit: '°C' },
    { label: 'Humedad relativa actual', value: '--', unit: '%' },
    { label: 'Agua recolectada diariamente', value: '--', unit: 'ml' },
  ];

  // Prepara las métricas de progreso (ejemplo con agua recolectada)
  // Puedes ajustar los valores máximos según tus necesidades
  const progressMetrics: ProgressMetric[] = latestMeasurement ? [
    { 
      label: 'Nivel de Humedad', 
      currentValue: parseFloat(latestMeasurement.humidity), 
      maxValue: 100, // Asume un máximo de 100%
      unit: '%', 
      percentage: parseFloat(latestMeasurement.humidity) 
    },
    { 
      label: 'Progreso en la recolección de agua', 
      currentValue: parseFloat(latestMeasurement.water_collected), 
      maxValue: 2500, // Valor máximo de ejemplo, ajusta según tu proyecto
      unit: 'ml' 
    },
  ] : [
    { label: 'Nivel de Humedad', currentValue: 0, maxValue: 100, unit: '%', percentage: 0 },
    { label: 'Progreso en la recolección de agua', currentValue: 0, maxValue: 2500, unit: 'ml' },
  ];

  if (loading) {
    return (
      <div className="text-center text-brand-text-light text-xl mt-10">Cargando datos...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Error: {error}
        <br />
        Asegúrate de que tu servidor backend está corriendo en http://localhost:5000
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-light mb-6">Datos en tiempo real</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewMetrics.map((metric) => (
          <DashboardCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            unit={metric.unit}
          />
        ))}
      </div>

      <div className="space-y-6 bg-brand-card p-6 rounded-lg shadow-lg">
        {progressMetrics.map((metric) => (
          <ProgressBar
            key={metric.label}
            label={metric.label}
            percentage={metric.percentage !== undefined ? metric.percentage : (metric.currentValue / metric.maxValue) * 100}
            valueText={metric.maxValue > 0 ? `${metric.currentValue.toFixed(1)} ${metric.unit} / ${metric.maxValue} ${metric.unit}` : `${metric.currentValue.toFixed(1)} ${metric.unit}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;