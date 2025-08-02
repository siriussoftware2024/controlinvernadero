import React from 'react';

const ActuatorControl = ({ 
  title, 
  isOn, 
  onToggle, 
  icon, 
  color = 'blue',
  description = '',
  loading = false,
  isControl = true
}) => {
  const getStatusColor = () => {
    if (loading) return 'text-gray-400';
    return isOn ? 'text-green-600' : 'text-gray-400';
  };

  const getCardColor = () => {
    if (loading) return 'border-gray-200 bg-gray-50';
    return isOn 
      ? 'border-green-200 bg-green-50' 
      : 'border-gray-200 bg-gray-50';
  };

  const getToggleColor = () => {
    if (loading) return 'bg-gray-300';
    return isOn ? 'bg-green-500' : 'bg-gray-300';
  };

  const getTogglePosition = () => {
    if (loading) return 'translate-x-0';
    return isOn ? 'translate-x-6' : 'translate-x-0';
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${getCardColor()} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor()} bg-white`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              {isControl && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Control
                </span>
              )}
              {!isControl && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  Indicador
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        </div>
        
        {isControl ? (
          <button
            onClick={onToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 ${
              loading ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${getTogglePosition()}`}
            />
            <span className={`inline-block h-6 w-12 rounded-full transition-colors ${getToggleColor()}`} />
          </button>
        ) : (
          <div className={`relative inline-flex h-6 w-12 items-center rounded-full ${getToggleColor()} opacity-60`}>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${getTogglePosition()}`}
            />
          </div>
        )}
      </div>
      
      <div className="text-center">
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {loading ? 'Cargando...' : (isOn ? 'ENCENDIDO' : 'APAGADO')}
        </div>
        {!isControl && (
          <div className="text-xs text-gray-500 mt-1">
            Solo lectura
          </div>
        )}
      </div>
    </div>
  );
};

export default ActuatorControl; 