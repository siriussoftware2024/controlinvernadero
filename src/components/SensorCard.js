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

  return (
    <div className={`p-6 rounded-xl border-2 ${getCardColor()} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-1">
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