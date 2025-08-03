import React from 'react';

const RemoteControl = ({
    title,
    isOn,
    onToggle,
    icon,
    color = 'purple',
    description = '',
    loading = false,
    actuatorId,
    isProtected = false // New prop to indicate if this control is protected from auto-refresh
}) => {
    const getStatusColor = () => {
        if (loading) return 'text-blue-600';
        if (isProtected) return 'text-orange-600';
        return isOn ? 'text-green-600' : 'text-gray-400';
    };

    const getCardColor = () => {
        if (loading) return 'border-blue-200 bg-blue-50';
        if (isProtected) return 'border-orange-200 bg-orange-50';
        return isOn
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-gray-50';
    };

    const getToggleColor = () => {
        if (loading) return 'bg-blue-400';
        if (isProtected) return 'bg-orange-400';
        return isOn ? 'bg-green-500' : 'bg-gray-300';
    };

    const getTogglePosition = () => {
        if (loading) return 'translate-x-3';
        return isOn ? 'translate-x-6' : 'translate-x-0';
    };

    const getRealisticIcon = () => {
        const baseClasses = `w-12 h-12 transition-all duration-300 ${isOn ? 'text-purple-500' : 'text-gray-400'}`;

        return (
            <div className={baseClasses}>
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    <circle cx="12" cy="12" r="1" />
                </svg>
            </div>
        );
    };

    return (
        <div className={`p-6 rounded-xl border-2 ${getCardColor()} shadow-lg hover-lift transition-all duration-300 ${loading ? 'ring-2 ring-blue-300' : ''} ${isProtected ? 'ring-2 ring-orange-300' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {getRealisticIcon()}
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                Control Manual
                            </span>
                            {loading && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full animate-pulse">
                                    Enviando...
                                </span>
                            )}
                            {isProtected && !loading && (
                                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full animate-pulse">
                                    Confirmando...
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="text-sm text-gray-600">{description}</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={onToggle}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${getTogglePosition()}`}
                    />
                    <span className={`inline-block h-6 w-12 rounded-full transition-colors ${getToggleColor()}`} />
                </button>
            </div>

            <div className="text-center">
                <div className={`text-sm font-medium ${getStatusColor()}`}>
                    {loading ? 'Enviando comando...' : 
                     isProtected ? 'Esperando confirmación...' :
                     (isOn ? 'ACTIVADO' : 'DESACTIVADO')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    ID: {actuatorId}
                </div>
            </div>
        </div>
    );
};

export default RemoteControl; 