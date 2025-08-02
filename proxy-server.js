const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Habilitar CORS para todas las rutas
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Configurar proxy para redirigir al Arduino
app.use('/', createProxyMiddleware({
    target: 'http://192.168.2.14',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxy request: ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy response: ${proxyRes.statusCode} for ${req.url}`);
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'Proxy error', message: err.message });
    }
}));

app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Proxying requests to http://192.168.2.14`);
    console.log(`🔧 CORS enabled for all origins`);
});

// Manejo de errores
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 