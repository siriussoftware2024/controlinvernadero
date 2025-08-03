import axios from 'axios';

// Get configuration from environment variables
const ARDUINO_IP = process.env.REACT_APP_ARDUINO_IP || '192.168.2.14';
const ARDUINO_PORT = process.env.REACT_APP_ARDUINO_PORT || '80';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;

// Build API base URL
const API_BASE_URL = `http://${ARDUINO_IP}:${ARDUINO_PORT}`;

// Log connection information
console.log('🔧 API Configuration:');
console.log('📍 Arduino IP:', ARDUINO_IP);
console.log('🔌 Arduino Port:', ARDUINO_PORT);
console.log('⏱️  API Timeout:', API_TIMEOUT);
console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance with timeout and CORS headers
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add withCredentials for CORS
  withCredentials: false,
});

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
  // Get connection info
  getConnectionInfo: () => ({
    ip: ARDUINO_IP,
    port: ARDUINO_PORT,
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT
  }),

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

  // Test connection
  testConnection: async () => {
    try {
      const response = await api.get('/datos');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default greenhouseAPI; 