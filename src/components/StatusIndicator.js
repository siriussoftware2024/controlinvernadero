import React from 'react';

const StatusIndicator = ({ isConnected, lastUpdate, error }) => {
    const getStatusColor = () => {
        if (error) return 'text-red-600 bg-red-100';
        if (isConnected) return 'text-green-600 bg-green-100';
        return 'text-yellow-600 bg-yellow-100';
    };

    const getStatusText = () => {
        if (error) return 'Error de conexión';
        if (isConnected) return 'Conectado';
        return 'Desconectado';
    };

    const getStatusIcon = () => {
        if (error) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            );
        }
        if (isConnected) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        );
    };

    const formatLastUpdate = () => {
        if (!lastUpdate) return 'Nunca';
        const now = new Date();
        const diff = now - lastUpdate;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);

        if (seconds < 60) return `${seconds}s`;
        if (minutes < 60) return `${minutes}m`;
        return `${Math.floor(minutes / 60)}h`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor()}`}>
                        {getStatusIcon()}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Estado del Sistema</h3>
                        <p className="text-sm text-gray-500">
                            Última actualización: {formatLastUpdate()}
                        </p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                </div>
            </div>

            {error && (
                <div className="mt-1 p-1 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
        </div>
    );
};

export default StatusIndicator; 