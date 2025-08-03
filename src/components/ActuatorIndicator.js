import React from 'react';

const ActuatorIndicator = ({
    title,
    isOn,
    icon,
    color = 'blue',
    description = '',
    type = 'bulb' // bulb, fan, pump
}) => {
    const getStatusColor = () => {
        return isOn ? 'text-green-600' : 'text-gray-400';
    };

    const getCardColor = () => {
        return isOn
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-gray-50';
    };

    const getAnimationClass = () => {
        if (!isOn) return '';

        switch (type) {
            case 'fan':
                return 'animate-fan-spin';
            case 'pump':
                return 'animate-pump-pulse';
            case 'bulb':
                return 'animate-bulb-glow';
            default:
                return '';
        }
    };

    const getGlowEffect = () => {
        if (!isOn) return '';

        switch (type) {
            case 'bulb':
                return 'shadow-lg shadow-yellow-400/50';
            case 'fan':
                return 'shadow-lg shadow-blue-400/50';
            case 'pump':
                return 'shadow-lg shadow-blue-400/50';
            default:
                return '';
        }
    };

    const getRealisticIcon = () => {
        const baseClasses = `w-16 h-16 ${getAnimationClass()} ${getGlowEffect()} transition-all duration-300`;

        switch (type) {
            case 'bulb':
                return (
                    <div className={`${baseClasses} ${isOn ? 'text-yellow-500' : 'text-gray-400'}`}>
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" />
                            <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </div>
                );
            case 'fan':
                return (
                    <div className={`${baseClasses} ${isOn ? 'text-blue-500' : 'text-gray-400'}`}>
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m5.5-5.5l4.5 4.5m0 0l4.5-4.5m-4.5 4.5l-4.5-4.5m4.5 4.5l4.5 4.5" />
                        </svg>
                    </div>
                );
            case 'pump':
                return (
                    <div className={`${baseClasses} ${isOn ? 'text-blue-500' : 'text-gray-400'}`}>
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            <path d="M8 12h8M12 8v8" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className={`${baseClasses} ${isOn ? 'text-green-500' : 'text-gray-400'}`}>
                        {icon}
                    </div>
                );
        }
    };

    return (
        <div className={`p-4 rounded-xl border-2 ${getCardColor()} shadow-lg hover-lift transition-all duration-300`}>
            <div className="text-center">
                <div className="flex justify-center mb-3">
                    {getRealisticIcon()}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>

                {description && (
                    <p className="text-sm text-gray-600 mb-3">{description}</p>
                )}

                <div className={`text-sm font-medium ${getStatusColor()}`}>
                    {isOn ? 'ACTIVO' : 'INACTIVO'}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                    Indicador automático
                </div>
            </div>
        </div>
    );
};

export default ActuatorIndicator; 