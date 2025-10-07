
import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { SavingsCardData } from '../types';
import { UpArrowIcon } from '../icons';

const savingsData: SavingsCardData[] = [
  { title: 'Ahorros aproximados', value: '₡100.000', percentageChange: '+15%', positive: true },
  { title: 'Impacto', value: 'Aumento del rendimiento de los cultivos y ganadería en un 20%', percentageChange: '+10%', positive: true },
];

const SavingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-light mb-6">Ahorros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsData.map((item) => (
          <DashboardCard key={item.title} title={item.title} value="" className="!pb-3"> {/* Custom padding */}
            <p className="text-4xl font-bold text-brand-text-light mt-2 mb-1">{item.value.split(" ")[0]} <span className="text-2xl text-brand-text-medium">{item.value.substring(item.value.indexOf(" ") + 1)}</span></p>
            <div className={`flex items-center text-sm ${item.positive ? 'text-brand-green' : 'text-brand-red'}`}>
              <UpArrowIcon className="w-4 h-4 mr-1" /> {/* Assuming positive for now */}
              <span>{item.percentageChange}</span>
            </div>
          </DashboardCard>
        ))}
      </div>

      <div className="bg-brand-card p-6 rounded-lg shadow-lg">
        <p className="text-brand-text-medium leading-relaxed">
          El Sistema MistCatcher lleva un registro de los ahorros y el impacto producidos por el sistema.
        </p>
      </div>
    </div>
  );
};

export default SavingsPage;
