import React, { useState, useEffect, useRef } from 'react';

const ConnectionConfig = ({ currentConnectionInfo, onConnectionChange, onTestConnection, onResetConfig }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [ipAddress, setIpAddress] = useState('');
    const [port, setPort] = useState('80');
    const [timeout, setTimeout] = useState('10000');
    const [isLoading, setIsLoading] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [hasUserEdited, setHasUserEdited] = useState(false);
    const initialLoadRef = useRef(false);

    // Initialize form with current values only once
    useEffect(() => {
        if (currentConnectionInfo && !initialLoadRef.current) {
            setIpAddress(currentConnectionInfo.ip);
            setPort(currentConnectionInfo.port);
            setTimeout(currentConnectionInfo.timeout.toString());
            initialLoadRef.current = true;
        }
    }, [currentConnectionInfo]);

    // Only update form when connection info changes if user hasn't edited
    useEffect(() => {
        if (currentConnectionInfo && initialLoadRef.current && !hasUserEdited && !isOpen) {
            setIpAddress(currentConnectionInfo.ip);
            setPort(currentConnectionInfo.port);
            setTimeout(currentConnectionInfo.timeout.toString());
        }
    }, [currentConnectionInfo, hasUserEdited, isOpen]);

    const handleInputChange = (field, value) => {
        setHasUserEdited(true);
        switch (field) {
            case 'ip':
                setIpAddress(value);
                break;
            case 'port':
                setPort(value);
                break;
            case 'timeout':
                setTimeout(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTestResult(null);

        try {
            // Test the new connection first
            const testResponse = await onTestConnection(ipAddress, port, timeout);

            if (testResponse.success) {
                // If test is successful, update the connection
                await onConnectionChange({
                    ip: ipAddress,
                    port: port,
                    timeout: parseInt(timeout)
                });
                setTestResult({ success: true, message: 'Conexión exitosa! Configuración actualizada.' });
                setIsOpen(false);
                setHasUserEdited(false); // Reset user edited flag
            } else {
                setTestResult({ success: false, message: `Error de conexión: ${testResponse.error}` });
            }
        } catch (error) {
            setTestResult({ success: false, message: `Error: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestOnly = async () => {
        setIsLoading(true);
        setTestResult(null);

        try {
            const testResponse = await onTestConnection(ipAddress, port, timeout);
            setTestResult({
                success: testResponse.success,
                message: testResponse.success
                    ? 'Conexión exitosa! Puedes guardar la configuración.'
                    : `Error de conexión: ${testResponse.error}`
            });
        } catch (error) {
            setTestResult({ success: false, message: `Error: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('¿Estás seguro de que quieres resetear la configuración a los valores por defecto?')) {
            setIsLoading(true);
            try {
                await onResetConfig();
                setTestResult({ success: true, message: 'Configuración reseteada a valores por defecto.' });
                setIsOpen(false);
                setHasUserEdited(false); // Reset user edited flag
                // Reset the form to default values
                if (currentConnectionInfo) {
                    setIpAddress(currentConnectionInfo.ip);
                    setPort(currentConnectionInfo.port);
                    setTimeout(currentConnectionInfo.timeout.toString());
                }
            } catch (error) {
                setTestResult({ success: false, message: `Error al resetear: ${error.message}` });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateIpAddress = (ip) => {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    };

    const isValidIp = validateIpAddress(ipAddress);
    const isValidPort = port >= 1 && port <= 65535;
    const isValidTimeout = timeout >= 1000 && timeout <= 60000;

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Configuración de Conexión</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span>Resetear</span>
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>{isOpen ? 'Ocultar' : 'Configurar'}</span>
                    </button>
                </div>
            </div>

            {isOpen && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IP del Arduino
                            </label>
                            <input
                                type="text"
                                value={ipAddress}
                                onChange={(e) => handleInputChange('ip', e.target.value)}
                                placeholder="192.168.1.100"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${ipAddress && !isValidIp ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {ipAddress && !isValidIp && (
                                <p className="text-xs text-red-600 mt-1">IP inválida</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Puerto
                            </label>
                            <input
                                type="number"
                                value={port}
                                onChange={(e) => handleInputChange('port', e.target.value)}
                                min="1"
                                max="65535"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${port && !isValidPort ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {port && !isValidPort && (
                                <p className="text-xs text-red-600 mt-1">Puerto inválido (1-65535)</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Timeout (ms)
                            </label>
                            <input
                                type="number"
                                value={timeout}
                                onChange={(e) => handleInputChange('timeout', e.target.value)}
                                min="1000"
                                max="60000"
                                step="1000"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${timeout && !isValidTimeout ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {timeout && !isValidTimeout && (
                                <p className="text-xs text-red-600 mt-1">Timeout inválido (1000-60000)</p>
                            )}
                        </div>
                    </div>

                    {/* Test Result */}
                    {testResult && (
                        <div className={`p-3 rounded-md ${testResult.success
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            <div className="flex items-center space-x-2">
                                {testResult.success ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">{testResult.message}</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={handleTestOnly}
                            disabled={isLoading || !isValidIp || !isValidPort || !isValidTimeout}
                            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Probando...' : 'Probar Conexión'}
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || !isValidIp || !isValidPort || !isValidTimeout}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar y Conectar'}
                        </button>
                    </div>

                    {/* Current Configuration */}
                    {currentConnectionInfo && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Configuración Actual:</h4>
                            <div className="text-xs text-gray-600 space-y-1">
                                <div>IP: {currentConnectionInfo.ip}</div>
                                <div>Puerto: {currentConnectionInfo.port}</div>
                                <div>URL: {currentConnectionInfo.baseUrl}</div>
                                <div>Timeout: {currentConnectionInfo.timeout}ms</div>
                            </div>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default ConnectionConfig; 