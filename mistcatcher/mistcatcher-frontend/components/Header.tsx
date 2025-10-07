
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItemType } from '../types';

interface HeaderProps {
  appName: string;
  navItems: NavItemType[];
  logoIcon: React.ReactNode;
  notificationIcon: React.ReactNode;
  userProfileIcon: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ appName, navItems, logoIcon, notificationIcon, userProfileIcon }) => {
  return (
    <header className="bg-brand-card shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {logoIcon}
            <span className="ml-2 text-xl font-semibold text-brand-text-light">{appName}</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-brand-accent text-white' 
                    : 'text-brand-text-medium hover:bg-slate-700 hover:text-brand-text-light'}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-brand-text-medium hover:text-brand-text-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-card focus:ring-white">
              {notificationIcon}
            </button>
            {userProfileIcon}
          </div>
        </div>
        {/* Mobile menu (optional, for simplicity not fully implemented here) */}
        <div className="md:hidden flex justify-center py-2 space-x-2 border-t border-slate-700">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-2 py-1 rounded-md text-xs font-medium transition-colors
                  ${isActive 
                    ? 'bg-brand-accent text-white' 
                    : 'text-brand-text-medium hover:bg-slate-700 hover:text-brand-text-light'}`
                }
              >
                {item.name}
              </NavLink>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
