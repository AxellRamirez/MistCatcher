
import React from 'react';
import DashboardCard from '../components/DashboardCard';

const SettingsPage: React.FC = () => {
  // In a real app, this status would come from an API or state management
  const systemOnline = true; 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-light mb-6">Estado del Sistema</h1>
      
      <DashboardCard title="Estado del Sistema" value="">
          <p className={`text-2xl font-semibold ${systemOnline ? 'text-brand-green' : 'text-brand-red'}`}>
            {systemOnline ? 'Online' : 'Offline'}
          </p>
      </DashboardCard>

      <div className="bg-brand-card p-6 rounded-lg shadow-lg">
        <p className="text-brand-text-medium leading-relaxed">
          El Sistema MistCatcher está actualmente {systemOnline ? 'operando y comunicandose con el arduino y la base de datos.' : 'Fallos en el sistema, por favor revisa las conexiones.'}
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
