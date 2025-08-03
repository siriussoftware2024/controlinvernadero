import axios from 'axios';
import { configStorage } from '../utils/configStorage';

// Load configuration from localStorage or use defaults
const savedConfig = configStorage.loadConfig();
const defaultConfig = configStorage.getDefaultConfig();

// Configuration state
let config = savedConfig || defaultConfig;

// Create axios instance
let api = createApiInstance();

function createApiInstance() {
  const baseURL = `http://${config.ip}:${config.port}`;

  console.log('🔧 API Configuration:');
  console.log('📍 Arduino IP:', config.ip);
  console.log('🔌 Arduino Port:', config.port);
  console.log('⏱️  API Timeout:', config.timeout);
  console.log('🌐 API Base URL:', baseURL);

  return axios.create({
    baseURL: baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: false,
  });
}

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making request to:', config.url);
    console.log('📋 Request config:', {
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
      timeout: config.timeout
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status);
    console.log('📄 Response data:', response.data);
    console.log('🔗 Response headers:', response.headers);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
);

// API functions
export const greenhouseAPI = {
  // Update configuration
  updateConfig: (newConfig) => {
    config = { ...config, ...newConfig };
    api = createApiInstance();

    // Save to localStorage
    configStorage.saveConfig(config);

    console.log('🔄 API Configuration updated:', config);
  },

  // Reset to default configuration
  resetConfig: () => {
    config = defaultConfig;
    api = createApiInstance();

    // Clear localStorage
    configStorage.clearConfig();

    console.log('🔄 API Configuration reset to defaults:', config);
  },

  // Get connection info
  getConnectionInfo: () => ({
    ip: config.ip,
    port: config.port,
    baseUrl: `http://${config.ip}:${config.port}`,
    timeout: config.timeout
  }),

  // Test connection with specific config
  testConnection: async (ip, port, timeout) => {
    try {
      const testApi = axios.create({
        baseURL: `http://${ip}:${port}`,
        timeout: parseInt(timeout),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false,
      });

      const response = await testApi.get('/datos');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all sensor data
  getData: async () => {
    try {
      const response = await api.get('/datos');
      console.log('Sensor data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);

      // Provide more specific error messages
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout: El Arduino no respondió en el tiempo esperado');
      }

      if (error.response?.status === 0) {
        throw new Error('Error de CORS: No se puede conectar al Arduino desde el navegador');
      }

      if (error.response?.status === 404) {
        throw new Error('Endpoint no encontrado: Verifica que el Arduino esté funcionando');
      }

      if (error.response?.status >= 500) {
        throw new Error('Error del servidor Arduino: Verifica la conexión');
      }

      throw new Error(`Error de conexión: ${error.message}`);
    }
  },

  // Control actuators
  turnOnActuator: async (actuatorId) => {
    try {
      const response = await api.get(`/cmd/ON${actuatorId}`);
      console.log(`Actuator ${actuatorId} turned ON:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error turning on actuator ${actuatorId}:`, error);
      throw new Error(`Error al encender actuador ${actuatorId}: ${error.message}`);
    }
  },

  turnOffActuator: async (actuatorId) => {
    try {
      const response = await api.get(`/cmd/OFF${actuatorId}`);
      console.log(`Actuator ${actuatorId} turned OFF:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error turning off actuator ${actuatorId}:`, error);
      throw new Error(`Error al apagar actuador ${actuatorId}: ${error.message}`);
    }
  },

  // Set temperature setpoint
  setTemperatureSetpoint: async (temperature) => {
    try {
      const response = await api.get(`/setpoint/temp/${temperature}`);
      console.log(`Temperature setpoint set to ${temperature}:`, response.data);
      return response.data;
    } catch (error) {
      console.error('Error setting temperature setpoint:', error);
      throw new Error(`Error al establecer temperatura: ${error.message}`);
    }
  },

  // Set humidity setpoint
  setHumiditySetpoint: async (humidity) => {
    try {
      const response = await api.get(`/setpoint/hum/${humidity}`);
      console.log(`Humidity setpoint set to ${humidity}:`, response.data);
      return response.data;
    } catch (error) {
      console.error('Error setting humidity setpoint:', error);
      throw new Error(`Error al establecer humedad: ${error.message}`);
    }
  },
};

export default greenhouseAPI; 