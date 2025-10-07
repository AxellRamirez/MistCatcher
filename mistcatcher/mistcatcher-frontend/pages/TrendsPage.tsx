// src/pages/TrendsPage.tsx

import React, { useState, useCallback, useEffect } from 'react'; // Importar useEffect
import ChartCard from '../components/ChartCard';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { HistoricalDataPoint, TimeRange } from '../types'; // Asegúrate de que HistoricalDataPoint coincida con tus datos

// Definir la interfaz para los datos históricos que esperamos del backend
// Asegúrate de que los nombres de las propiedades coincidan con los de tu DB
interface DbMeasurement {
  id: number;
  temperature: string;
  humidity: string;
  water_collected: string;
  timestamp: string; // Esto viene como string ISO del backend
}

const TrendsPage: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear el timestamp para el eje X
  const formatTimestampForChart = (timestamp: string, range: TimeRange) => {
    const date = new Date(timestamp);
    if (range === TimeRange.LAST_24_HOURS) {
      // Para las últimas 24 horas, mostrar la hora (ej. 14:00)
      return date.getHours() + ':00';
    } else if (range === TimeRange.LAST_MONTH) {
      // Para el último mes, mostrar día/mes (ej. 15/06)
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } else { // LAST_7_DAYS (o cualquier otro rango por defecto)
      // Para los últimos 7 días, mostrar día de la semana
      const days = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'];
      return days[date.getDay()];
    }
  };

  // Función para obtener los datos históricos
  const fetchHistoricalData = useCallback(async (range: TimeRange) => {
    setLoading(true);
    setError(null);
    let limit = 0; // Número de mediciones a solicitar

    // Ajusta el límite según el rango de tiempo. Estos son ejemplos,
    // puedes necesitar un cálculo más preciso o que el backend lo maneje.
    switch (range) {
      case TimeRange.LAST_24_HOURS:
        limit = 24; // Asume una medición por hora
        break;
      case TimeRange.LAST_7_DAYS:
        limit = 7 * 24; // Asume 7 días * 24 mediciones por día (ajusta si solo quieres 7 puntos)
        break;
      case TimeRange.LAST_MONTH:
        limit = 30 * 24; // Asume 30 días * 24 mediciones por día (ajusta si solo quieres 30 puntos)
        break;
      default:
        limit = 100; // Un límite por defecto si el rango no se reconoce
    }

    try {
      const response = await fetch(`http://localhost:5000/api/measurements?limit=${limit}&orderDir=asc`); // Pedimos en orden ascendente para las gráficas
      
      if (!response.ok) {
        throw new Error(`Error al obtener los datos históricos: ${response.statusText}`);
      }
      
      const data: DbMeasurement[] = await response.json();

      // Transformar los datos del backend al formato que necesita Recharts
      // y tus componentes ChartCard.
      const transformedData: HistoricalDataPoint[] = data.map(item => ({
        // 'name' para el eje X (fecha/hora formateada)
        name: formatTimestampForChart(item.timestamp, range), 
        temperature: parseFloat(item.temperature),
        humidity: parseFloat(item.humidity),
        water: parseFloat(item.water_collected),
        // Agrega otras propiedades si las necesitas para los tooltips, etc.
        fullTimestamp: item.timestamp // Para usar en el tooltip si se desea
      }));

      setChartData(transformedData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos históricos.');
    } finally {
      setLoading(false);
    }
  }, []); // Dependencias vacías para useCallback porque no depende de nada del exterior que cambie

  // Cargar datos cuando el componente se monta o cuando cambia el rango seleccionado
  useEffect(() => {
    fetchHistoricalData(selectedRange);
  }, [selectedRange, fetchHistoricalData]); // fetchHistoricalData es una dependencia de useCallback

  const handleRangeChange = useCallback((range: TimeRange) => {
    setSelectedRange(range);
    // fetchHistoricalData se llamará automáticamente vía useEffect
  }, []);
  
  // Calcular valores actuales y totales de los datos cargados
  const currentTemp = chartData.length > 0 ? chartData[chartData.length - 1].temperature : 0;
  const currentHumidity = chartData.length > 0 ? chartData[chartData.length - 1].humidity : 0;
  const totalWater = chartData.reduce((sum, item) => sum + (item.water || 0), 0);

  if (loading) {
    return (
      <div className="text-center text-brand-text-light text-xl mt-10">Cargando datos históricos...</div>
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
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-light">Tendencias Históricas</h1>
      <p className="text-brand-text-medium mb-6">
        Explora las tendencias sobre la temperatura, humedad y agua a través del tiempo.
      </p>
      
      <TimeRangeSelector onSelectRange={handleRangeChange} defaultRange={selectedRange} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Temperatura vs. Tiempo"
          currentValue={`${currentTemp.toFixed(1)}°C`}
          changePeriod={selectedRange}
          changePercentage={0} // Este valor de "cambio" necesitará lógica real si lo quieres dinámico
          data={chartData}
          dataKey="temperature"
          chartType="line"
          color="#3B82F6" // blue-500
        />
        <ChartCard
          title="Humedad vs. Tiempo"
          currentValue={`${currentHumidity.toFixed(1)}%`}
          changePeriod={selectedRange}
          changePercentage={0} // Este valor de "cambio" necesitará lógica real si lo quieres dinámico
          data={chartData}
          dataKey="humidity"
          chartType="line"
          color="#8B5CF6" // violet-500
        />
        <ChartCard
          title="Acumulación de agua vs. Tiempo"
          currentValue={`${totalWater.toFixed(1)} ml`} // Asumiendo ml, ajusta unidad si es L
          changePeriod={selectedRange}
          changePercentage={0} // Este valor de "cambio" necesitará lógica real si lo quieres dinámico
          data={chartData}
          dataKey="water"
          chartType="bar"
          color="#10B981" // emerald-500
        />
      </div>
    </div>
  );
};

export default TrendsPage;