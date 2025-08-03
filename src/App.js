import React, { useState, useEffect, useCallback } from 'react';
import SensorCard from './components/SensorCard';
import ActuatorIndicator from './components/ActuatorIndicator';
import RemoteControl from './components/RemoteControl';
import SetpointControl from './components/SetpointControl';
import StatusIndicator from './components/StatusIndicator';
import Notification from './components/Notification';
import ConnectionTest from './components/ConnectionTest';
import SimpleTest from './components/SimpleTest';
import { greenhouseAPI } from './services/api';

// Icons for sensors and actuators
const Icons = {
    temperature: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
    ),
    humidity: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    ),
    soil: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    bulb: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
    ),
    fan: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
    ),
    pump: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    ),
    remote: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
    ),
};

function App() {
    const [sensorData, setSensorData] = useState({
        temperature: null,
        humidity: null,
        soilHumidity: null,
        bulbOn: false,
        ventTempOn: false,
        ventHumOn: false,
        pumpOn: false,
        remote1On: false,
        remote2On: false,
        setpointTemp: 80.0,
        setpointHum: 70.0
    });

    const [loading, setLoading] = useState({
        remote1: false,
        remote2: false,
        tempSetpoint: false,
        humSetpoint: false
    });

    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: false,
        lastUpdate: null,
        error: null
    });

    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'info'
    });

    // Track recent manual changes to avoid auto-refresh conflicts
    const [recentChanges, setRecentChanges] = useState({
        remote1On: null,
        remote2On: null,
        setpointTemp: null,
        setpointHum: null
    });

    // Get connection information
    const connectionInfo = greenhouseAPI.getConnectionInfo();

    // Show notification function
    const showNotification = (message, type = 'info') => {
        setNotification({
            isVisible: true,
            message,
            type
        });
    };

    // Hide notification function
    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            isVisible: false
        }));
    };

    // Fetch sensor data with smart conflict resolution
    const fetchData = useCallback(async () => {
        try {
            const data = await greenhouseAPI.getData();

            // Merge data with recent changes to avoid conflicts
            const mergedData = { ...data };

            // Check if we have recent manual changes that shouldn't be overwritten
            Object.keys(recentChanges).forEach(key => {
                if (recentChanges[key] !== null) {
                    const timeSinceChange = Date.now() - recentChanges[key];
                    // If change was made less than 3 seconds ago, keep the optimistic value
                    if (timeSinceChange < 3000) {
                        // Preserve the optimistic value from current state
                        mergedData[key] = sensorData[key];
                    } else {
                        // Clear the recent change tracking
                        setRecentChanges(prev => ({
                            ...prev,
                            [key]: null
                        }));
                    }
                }
            });

            setSensorData(mergedData);
            setConnectionStatus({
                isConnected: true,
                lastUpdate: new Date(),
                error: null
            });
        } catch (error) {
            setConnectionStatus({
                isConnected: false,
                lastUpdate: connectionStatus.lastUpdate,
                error: 'Error al conectar con el sistema'
            });
        }
    }, [connectionStatus.lastUpdate, recentChanges, sensorData]);

    // Control remote actuators only
    const toggleRemoteActuator = async (actuatorId, actuatorName) => {
        setLoading(prev => ({ ...prev, [actuatorName]: true }));

        // Update local state immediately for instant feedback (optimistic update)
        const isCurrentlyOn = sensorData[actuatorName];
        setSensorData(prev => ({
            ...prev,
            [actuatorName]: !isCurrentlyOn
        }));

        // Track this manual change
        setRecentChanges(prev => ({
            ...prev,
            [actuatorName]: Date.now()
        }));

        try {
            // Send command to Arduino
            if (isCurrentlyOn) {
                await greenhouseAPI.turnOffActuator(actuatorId);
            } else {
                await greenhouseAPI.turnOnActuator(actuatorId);
            }

            // Wait a bit longer before refreshing to allow Arduino to process the command
            setTimeout(fetchData, 1000);

            // Show success notification
            showNotification(`${actuatorName} ${!isCurrentlyOn ? 'activado' : 'desactivado'} correctamente`, 'success');
        } catch (error) {
            console.error(`Error toggling ${actuatorName}:`, error);

            // Revert the optimistic update on error
            setSensorData(prev => ({
                ...prev,
                [actuatorName]: isCurrentlyOn
            }));

            // Clear the recent change tracking
            setRecentChanges(prev => ({
                ...prev,
                [actuatorName]: null
            }));

            // Show error notification
            showNotification(`Error al cambiar ${actuatorName}: ${error.message}`, 'error');
        } finally {
            setLoading(prev => ({ ...prev, [actuatorName]: false }));
        }
    };

    // Update setpoints
    const updateSetpoint = async (type, value) => {
        setLoading(prev => ({ ...prev, [`${type}Setpoint`]: true }));

        const setpointKey = `setpoint${type.charAt(0).toUpperCase() + type.slice(1)}`;

        // Update local state immediately for instant feedback
        setSensorData(prev => ({
            ...prev,
            [setpointKey]: value
        }));

        // Track this manual change
        setRecentChanges(prev => ({
            ...prev,
            [setpointKey]: Date.now()
        }));

        try {
            // Send command to Arduino
            if (type === 'temp') {
                await greenhouseAPI.setTemperatureSetpoint(value);
            } else if (type === 'hum') {
                await greenhouseAPI.setHumiditySetpoint(value);
            }

            // Quick refresh to confirm the change
            setTimeout(fetchData, 200);

            // Show success notification
            showNotification(`Referencia de ${type === 'temp' ? 'temperatura' : 'humedad'} actualizada a ${value}${type === 'temp' ? '°C' : '%'}`, 'success');
        } catch (error) {
            console.error(`Error updating ${type} setpoint:`, error);

            // Revert the optimistic update on error
            const originalValue = type === 'temp' ? sensorData.setpointTemp : sensorData.setpointHum;
            setSensorData(prev => ({
                ...prev,
                [setpointKey]: originalValue
            }));

            // Clear the recent change tracking
            setRecentChanges(prev => ({
                ...prev,
                [setpointKey]: null
            }));

            // Show error notification
            showNotification(`Error al actualizar referencia de ${type}: ${error.message}`, 'error');
        } finally {
            setLoading(prev => ({ ...prev, [`${type}Setpoint`]: false }));
        }
    };

    // Auto-refresh data every 2 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // Get sensor status based on setpoints
    const getSensorStatus = (sensorType, value) => {
        if (value === null || value === undefined) return 'normal';

        switch (sensorType) {
            case 'temperature':
                if (value > sensorData.setpointTemp + 5) return 'danger';
                if (value > sensorData.setpointTemp) return 'warning';
                return 'success';
            case 'humidity':
                if (value < sensorData.setpointHum - 10) return 'danger';
                if (value < sensorData.setpointHum) return 'warning';
                return 'success';
            case 'soilHumidity':
                if (value < 300) return 'danger';
                if (value < 400) return 'warning';
                return 'success';
            default:
                return 'normal';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-greenhouse-100 to-greenhouse-500">
            {/* Notification Component */}
            <Notification
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={hideNotification}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🌱 Control de Invernadero
                    </h1>
                    <p className="text-gray-600">
                        Sistema de monitoreo y control inteligente
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="mb-8">
                    <StatusIndicator
                        isConnected={connectionStatus.isConnected}
                        lastUpdate={connectionStatus.lastUpdate}
                        error={connectionStatus.error}
                        connectionInfo={connectionInfo}
                    />
                </div>

                {/* Setpoints Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        🎯 Referencias
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SetpointControl
                            title="Referencia de Temperatura"
                            value={sensorData.setpointTemp}
                            onValueChange={(value) => updateSetpoint('temp', value)}
                            min={0}
                            max={100}
                            step={0.5}
                            unit="°C"
                            icon={Icons.temperature}
                            color="red"
                            loading={loading.tempSetpoint}
                        />
                        <SetpointControl
                            title="Referencia de Humedad"
                            value={sensorData.setpointHum}
                            onValueChange={(value) => updateSetpoint('hum', value)}
                            min={0}
                            max={100}
                            step={1}
                            unit="%"
                            icon={Icons.humidity}
                            color="blue"
                            loading={loading.humSetpoint}
                        />
                    </div>
                </div>

                {/* Sensors Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        📊 Sensores
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SensorCard
                            title="Temperatura"
                            value={sensorData.temperature}
                            unit="°C"
                            icon={Icons.temperature}
                            color="red"
                            status={getSensorStatus('temperature', sensorData.temperature)}
                        />
                        <SensorCard
                            title="Humedad del Aire"
                            value={sensorData.humidity}
                            unit="%"
                            icon={Icons.humidity}
                            color="blue"
                            status={getSensorStatus('humidity', sensorData.humidity)}
                        />
                        <SensorCard
                            title="Humedad del Suelo"
                            value={sensorData.soilHumidity}
                            unit=""
                            icon={Icons.soil}
                            color="green"
                            status={getSensorStatus('soilHumidity', sensorData.soilHumidity)}
                        />
                    </div>
                </div>

                {/* Actuator Indicators Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        ⚡ Indicadores de Actuadores
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Estado de los actuadores automáticos del sistema
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ActuatorIndicator
                            title="Bombilla de Calefacción"
                            isOn={sensorData.bulbOn}
                            icon={Icons.bulb}
                            color="yellow"
                            description="Control automático de temperatura"
                            type="bulb"
                        />
                        <ActuatorIndicator
                            title="Ventilador de Temperatura"
                            isOn={sensorData.ventTempOn}
                            icon={Icons.fan}
                            color="blue"
                            description="Enfriamiento automático"
                            type="fan"
                        />
                        <ActuatorIndicator
                            title="Ventilador de Humedad"
                            isOn={sensorData.ventHumOn}
                            icon={Icons.fan}
                            color="green"
                            description="Control automático de humedad"
                            type="fan"
                        />
                        <ActuatorIndicator
                            title="Bomba de Agua"
                            isOn={sensorData.pumpOn}
                            icon={Icons.pump}
                            color="blue"
                            description="Riego automático"
                            type="pump"
                        />
                    </div>
                </div>

                {/* Remote Controls Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        🎮 Controles Remotos
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Controles manuales para actuadores remotos
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RemoteControl
                            title="Control Remoto 1"
                            isOn={sensorData.remote1On}
                            onToggle={() => toggleRemoteActuator(47, 'remote1On')}
                            icon={Icons.remote}
                            color="purple"
                            description="Control remoto manual 1"
                            loading={loading.remote1}
                            actuatorId="47"
                            isProtected={recentChanges.remote1On !== null}
                        />
                        <RemoteControl
                            title="Control Remoto 2"
                            isOn={sensorData.remote2On}
                            onToggle={() => toggleRemoteActuator(49, 'remote2On')}
                            icon={Icons.remote}
                            color="purple"
                            description="Control remoto manual 2"
                            loading={loading.remote2}
                            actuatorId="49"
                            isProtected={recentChanges.remote2On !== null}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-sm">
                    <p>Sistema de Control de Invernadero Inteligente</p>
                    <p>Desarrollado con React y Tailwind CSS</p>
                </div>
            </div>
        </div>
    );
}

export default App; 