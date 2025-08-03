const CONFIG_KEY = 'greenhouse_connection_config';

export const configStorage = {
    // Save configuration to localStorage
    saveConfig: (config) => {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
            console.log('💾 Configuration saved to localStorage:', config);
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    },

    // Load configuration from localStorage
    loadConfig: () => {
        try {
            const saved = localStorage.getItem(CONFIG_KEY);
            if (saved) {
                const config = JSON.parse(saved);
                console.log('📂 Configuration loaded from localStorage:', config);
                return config;
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
        return null;
    },

    // Clear saved configuration
    clearConfig: () => {
        try {
            localStorage.removeItem(CONFIG_KEY);
            console.log('🗑️ Configuration cleared from localStorage');
        } catch (error) {
            console.error('Error clearing configuration:', error);
        }
    },

    // Get default configuration
    getDefaultConfig: () => ({
        ip: process.env.REACT_APP_ARDUINO_IP || '192.168.2.14',
        port: process.env.REACT_APP_ARDUINO_PORT || '80',
        timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000
    })
};

export default configStorage; 