import React, { useState, useEffect } from 'react';
import { BarChart3, Wifi, WifiOff, Sun, Moon } from 'lucide-react';

const Header = ({ isOnline }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Stock Market Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time stock data and analytics
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Online Status */}
            <div className="flex items-center">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
              )}
              <span className={`text-sm font-medium ${
                isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Date */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
