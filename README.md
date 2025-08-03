# 🌱 Control de Invernadero

Sistema de monitoreo y control inteligente para invernaderos con interfaz web moderna desarrollada en React y Tailwind CSS.

## 🚀 Características

- **Monitoreo en tiempo real** de sensores (temperatura, humedad, humedad del suelo)
- **Control manual** de actuadores remotos
- **Indicadores automáticos** de actuadores (bombillas, ventiladores, bombas)
- **Configuración de setpoints** para temperatura y humedad
- **Interfaz responsiva** con animaciones y efectos visuales
- **Sistema de notificaciones** elegante
- **Configuración flexible** mediante variables de entorno

## 📋 Requisitos

- Node.js 14+ 
- npm o yarn
- Arduino con ESP8266 configurado
- Conexión WiFi

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `env.example`:

```bash
# Copia el archivo de ejemplo
cp env.example .env
```

Edita el archivo `.env` con tu configuración:

```env
# Configuración de la API del Arduino
REACT_APP_ARDUINO_IP=192.168.2.14
REACT_APP_ARDUINO_PORT=80
REACT_APP_API_TIMEOUT=10000

# Configuración del entorno
REACT_APP_ENVIRONMENT=development
REACT_APP_APP_NAME=Control de Invernadero
REACT_APP_VERSION=1.0.0
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Desarrollo Local

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Construcción para Producción

```bash
npm run build
```

## 🔧 Configuración del Arduino

### Endpoints Disponibles

- `GET /datos` - Obtiene todos los datos de sensores y estado de actuadores
- `GET /cmd/ON{id}` - Activa un actuador específico
- `GET /cmd/OFF{id}` - Desactiva un actuador específico
- `GET /setpoint/temp/{value}` - Establece el setpoint de temperatura
- `GET /setpoint/hum/{value}` - Establece el setpoint de humedad

### Formato de Respuesta JSON

```json
{
  "temperature": 25.5,
  "humidity": 65,
  "soilHumidity": 450,
  "bulbOn": false,
  "ventTempOn": true,
  "ventHumOn": false,
  "pumpOn": false,
  "remote1On": false,
  "remote2On": true,
  "setpointTemp": 80.0,
  "setpointHum": 70.0
}
```

## 🎮 Controles

### Actuadores Automáticos (Indicadores)
- **Bombilla de Calefacción**: Control automático de temperatura
- **Ventilador de Temperatura**: Enfriamiento automático
- **Ventilador de Humedad**: Control automático de humedad
- **Bomba de Agua**: Riego automático

### Controles Manuales
- **Control Remoto 1**: Actuador manual (ID: 47)
- **Control Remoto 2**: Actuador manual (ID: 49)

## 📊 Sensores

- **Temperatura**: Monitoreo en tiempo real con setpoint configurable
- **Humedad del Aire**: Control de humedad ambiental
- **Humedad del Suelo**: Monitoreo de riego

## 🎨 Características de la Interfaz

- **Actualización optimista**: Respuesta inmediata a controles
- **Protección de cambios**: Evita conflictos con auto-refresh
- **Animaciones**: Efectos visuales para actuadores activos
- **Notificaciones**: Sistema de alertas elegante
- **Información de conexión**: Muestra IP y configuración del Arduino

## 🔍 Solución de Problemas

### Error de CORS
Si experimentas errores de CORS, asegúrate de que el Arduino tenga configurados los headers CORS correctos.

### Problemas de Conexión
1. Verifica que la IP del Arduino sea correcta en el archivo `.env`
2. Asegúrate de que el Arduino esté en la misma red WiFi
3. Comprueba que el puerto 80 esté abierto

### Latencia en Controles
- Los controles manuales tienen actualización optimista
- El sistema protege los cambios recientes por 3 segundos
- Los indicadores automáticos se actualizan cada 2 segundos

## 📱 Despliegue

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en Netlify
3. El build se ejecutará automáticamente

### Variables de Entorno en Producción
Asegúrate de configurar las variables de entorno en tu plataforma de hosting:
- `REACT_APP_ARDUINO_IP`
- `REACT_APP_ARDUINO_PORT`
- `REACT_APP_API_TIMEOUT`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para el control inteligente de invernaderos.

---

**Nota**: Asegúrate de que el Arduino esté configurado correctamente y que la IP en el archivo `.env` coincida con la IP asignada a tu dispositivo Arduino. 