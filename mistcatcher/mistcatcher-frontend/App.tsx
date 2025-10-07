
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import OverviewPage from './pages/OverviewPage';
import TrendsPage from './pages/TrendsPage';
import SavingsPage from './pages/SavingsPage';
import SettingsPage from './pages/SettingsPage';
import { NAV_ITEMS, APP_NAME } from './constants';
import { MistCatcherLogoIcon, BellIcon, UserProfileIcon } from './icons';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-dark">
      <Header 
        appName={APP_NAME} 
        navItems={NAV_ITEMS}
        logoIcon={<MistCatcherLogoIcon className="h-12 w-12 text-brand-accent-light" />}
        notificationIcon={<BellIcon className="h-6 w-6 text-brand-text-medium hover:text-brand-text-light" />}
        userProfileIcon={<UserProfileIcon className="h-8 w-8" />}
      />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OverviewPage />} />
          <Route path="history" element={<TrendsPage />} />
          <Route path="savings" element={<SavingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* You can add a 404 page here if needed */}
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
