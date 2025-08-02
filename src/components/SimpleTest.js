import React, { useState } from 'react';

const SimpleTest = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const testDirectFetch = async () => {
        setLoading(true);
        setResult(null);

        try {
            console.log('🧪 Testing direct fetch to Arduino...');

            const response = await fetch('http://192.168.2.11/datos', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Data received:', data);
                setResult({ success: true, data, status: response.status });
            } else {
                console.log('❌ Response not ok:', response.status, response.statusText);
                setResult({
                    success: false,
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status
                });
            }
        } catch (error) {
            console.error('💥 Fetch error:', error);
            setResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const testAxios = async () => {
        setLoading(true);
        setResult(null);

        try {
            console.log('🧪 Testing axios request...');

            const axios = require('axios');
            const response = await axios.get('http://192.168.2.14/datos', {
                timeout: 5000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            console.log('✅ Axios response:', response.data);
            setResult({ success: true, data: response.data, status: response.status });
        } catch (error) {
            console.error('💥 Axios error:', error);
            setResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🧪 Prueba Simple de Conexión
            </h3>

            <div className="space-y-4">
                <div className="flex space-x-4">
                    <button
                        onClick={testDirectFetch}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Probando...' : 'Probar Fetch Directo'}
                    </button>

                    <button
                        onClick={testAxios}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? 'Probando...' : 'Probar Axios'}
                    </button>
                </div>

                {result && (
                    <div className={`p-4 rounded-md ${result.success
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}>
                        <h4 className={`font-medium mb-2 ${result.success ? 'text-green-800' : 'text-red-800'
                            }`}>
                            {result.success ? '✅ Éxito' : '❌ Error'}
                        </h4>

                        {result.success ? (
                            <div>
                                <p className="text-sm text-green-700 mb-2">
                                    Status: {result.status}
                                </p>
                                <pre className="text-xs bg-green-100 p-2 rounded overflow-auto max-h-40">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-red-700 mb-2">
                                    {result.error}
                                </p>
                                {result.status && (
                                    <p className="text-xs text-red-600">
                                        Status: {result.status}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">
                        💡 Información de Debug:
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Abre las herramientas de desarrollador (F12)</li>
                        <li>• Ve a la pestaña Console para ver logs detallados</li>
                        <li>• Ve a la pestaña Network para ver las peticiones</li>
                        <li>• Verifica que el Arduino esté en la IP correcta</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SimpleTest; 