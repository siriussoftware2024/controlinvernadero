import React, { useState } from 'react';
import { greenhouseAPI } from '../services/api';

const ConnectionTest = () => {
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manualUrl, setManualUrl] = useState('http://192.168.2.11/datos');

    const testConnection = async () => {
        setLoading(true);
        setTestResult(null);

        try {
            const result = await greenhouseAPI.testConnection();
            setTestResult(result);
        } catch (error) {
            setTestResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const testManualUrl = async () => {
        setLoading(true);
        setTestResult(null);

        try {
            const response = await fetch(manualUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTestResult({ success: true, data, status: response.status });
            } else {
                setTestResult({
                    success: false,
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status
                });
            }
        } catch (error) {
            setTestResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🔧 Prueba de Conexión
            </h3>

            <div className="space-y-4">
                {/* Test with API service */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Prueba con servicio API:
                    </h4>
                    <button
                        onClick={testConnection}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Probando...' : 'Probar Conexión'}
                    </button>
                </div>

                {/* Manual URL test */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Prueba manual con URL:
                    </h4>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={manualUrl}
                            onChange={(e) => setManualUrl(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="http://192.168.2.14/datos"
                        />
                        <button
                            onClick={testManualUrl}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? 'Probando...' : 'Probar URL'}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {testResult && (
                    <div className={`p-4 rounded-md ${testResult.success
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}>
                        <h4 className={`font-medium mb-2 ${testResult.success ? 'text-green-800' : 'text-red-800'
                            }`}>
                            {testResult.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión'}
                        </h4>

                        {testResult.success ? (
                            <div>
                                <p className="text-sm text-green-700 mb-2">
                                    Datos recibidos correctamente
                                </p>
                                <pre className="text-xs bg-green-100 p-2 rounded overflow-auto">
                                    {JSON.stringify(testResult.data, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-red-700 mb-2">
                                    {testResult.error}
                                </p>
                                {testResult.status && (
                                    <p className="text-xs text-red-600">
                                        Status: {testResult.status}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Troubleshooting tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">
                        💡 Soluciones para problemas de CORS:
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Verifica que el Arduino esté en la misma red</li>
                        <li>• Asegúrate de que la IP sea correcta</li>
                        <li>• El proxy de desarrollo debería resolver problemas de CORS</li>
                        <li>• Si persiste, configura CORS en tu Arduino</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ConnectionTest; 