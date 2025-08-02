# 🔧 Configuración de CORS para Arduino

## Problema
El navegador bloquea las peticiones HTTP desde tu aplicación React hacia el Arduino debido a políticas de CORS (Cross-Origin Resource Sharing).

## Soluciones

### 1. Configuración en el Código Arduino

Si tienes acceso al código del Arduino, agrega estos headers CORS:

```cpp
// En tu servidor web del Arduino
void handleCORS() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

// En cada endpoint, antes de enviar la respuesta:
void handleDatos() {
  handleCORS(); // Agregar esta línea
  
  // Tu código actual...
  String jsonResponse = "{\"temperature\": 25.5, \"humidity\": 60}";
  server.send(200, "application/json", jsonResponse);
}

// Para el endpoint OPTIONS (preflight requests)
void handleOptions() {
  handleCORS();
  server.send(200, "text/plain", "");
}
```

### 2. Configuración del Servidor Web

Si usas ESP8266WebServer o ESP32WebServer:

```cpp
// En setup()
server.enableCORS(true); // Habilitar CORS automáticamente

// O manualmente:
server.on("/datos", HTTP_GET, []() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  
  // Tu respuesta JSON aquí
  server.send(200, "application/json", jsonData);
});
```

### 3. Solución Temporal - Proxy Local

Si no puedes modificar el Arduino, usa un proxy local:

```bash
# Instalar http-server con CORS
npm install -g http-server

# Ejecutar proxy
http-server --cors -p 8080 -a 0.0.0.0
```

Luego cambia la URL en `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/http://192.168.2.14';
```

### 4. Verificación

Para verificar que CORS está funcionando:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Network
3. Haz una pestaña a tu Arduino
4. Verifica que aparezcan los headers CORS en la respuesta

### 5. Headers Esperados

En la respuesta del Arduino deberías ver:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

## Solución Inmediata

Mientras configuras CORS en el Arduino, usa el proxy de desarrollo de React:

1. El archivo `package.json` ya tiene configurado el proxy
2. Reinicia el servidor de desarrollo: `npm start`
3. Las peticiones ahora pasarán por el proxy de React

## Notas Importantes

- El proxy solo funciona en desarrollo
- Para producción, necesitas configurar CORS en el Arduino
- O usar un proxy en el servidor de producción 