import React from 'react';

const SensorCard = ({ title, value, unit, icon, color = 'blue', status = 'normal' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'danger':
        return 'text-red-600 bg-red-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getCardColor = () => {
    switch (color) {
      case 'green':
        return 'border-green-200 bg-green-50';
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50';
      case 'blue':
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getRealisticIcon = () => {
    const baseClasses = 'w-12 h-12 transition-all duration-300';

    switch (title.toLowerCase()) {
      case 'temperatura':
        return (
          <div className={`${baseClasses} text-red-500`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" />
              <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
        );
      case 'humedad del aire':
        return (
          <div className={`${baseClasses} text-blue-500`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              <path d="M8 12h8M12 8v8" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
        );
      case 'humedad del suelo':
        return (
          <div className={`${baseClasses} text-green-500`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              <path d="M6 12h12M8 8h8M10 16h4" />
              <circle cx="12" cy="12" r="1" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} ${getStatusColor()}`}>
            {icon}
          </div>
        );
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${getCardColor()} shadow-lg hover-lift transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getRealisticIcon()}
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value !== null && value !== undefined ? value : '--'}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {unit}
        </div>
      </div>
    </div>
  );
};

export default SensorCard; 