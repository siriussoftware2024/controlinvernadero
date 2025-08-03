# 🌱 Control de Invernadero

Sistema de monitoreo y control inteligente para invernaderos con Arduino y React.

## ✨ Características

- **Monitoreo en tiempo real** de sensores (temperatura, humedad del aire, humedad del suelo)
- **Control automático** de actuadores (bombilla, ventiladores, bomba de agua)
- **Control manual** de actuadores remotos
- **Configuración de referencias** (setpoints) para temperatura y humedad
- **Configuración dinámica de conexión** desde la interfaz
- **Interfaz moderna** con Tailwind CSS y animaciones
- **Notificaciones en tiempo real** para feedback del usuario
- **Persistencia de configuración** en localStorage

## 🚀 Configuración

### Requisitos

- Node.js 14+ y npm
- Arduino con ESP8266
- Sensores: DHT22 (temperatura/humedad), sensor de humedad del suelo
- Actuadores: Bombilla, ventiladores, bomba de agua, controles remotos

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd appControlInvernadero
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tu configuración:
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

### Desarrollo Local

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Build de Producción

```bash
npm run build
```

## 🔧 Configuración de Conexión

### Desde Variables de Entorno

La aplicación lee la configuración inicial desde el archivo `.env`:

- `REACT_APP_ARDUINO_IP`: IP del Arduino (por defecto: 192.168.2.14)
- `REACT_APP_ARDUINO_PORT`: Puerto del Arduino (por defecto: 80)
- `REACT_APP_API_TIMEOUT`: Timeout de la API en ms (por defecto: 10000)

### Desde la Interfaz

La aplicación incluye un panel de configuración que permite:

1. **Cambiar la IP del Arduino** sin reiniciar la aplicación
2. **Probar la conexión** antes de guardar cambios
3. **Configurar puerto y timeout** personalizados
4. **Resetear a valores por defecto** cuando sea necesario
5. **Persistencia automática** de la configuración en localStorage

**Para cambiar la IP:**
1. Hacer clic en "Configurar" en el panel de configuración
2. Ingresar la nueva IP del Arduino
3. Hacer clic en "Probar Conexión" para verificar
4. Hacer clic en "Guardar y Conectar" para aplicar los cambios

## 🏗️ Configuración del Arduino

### Endpoints de la API

- `GET /datos` - Obtener todos los datos de sensores y estado
- `GET /cmd/ON{id}` - Encender actuador con ID específico
- `GET /cmd/OFF{id}` - Apagar actuador con ID específico
- `GET /setpoint/temp/{value}` - Establecer referencia de temperatura
- `GET /setpoint/hum/{value}` - Establecer referencia de humedad

### Formato de Respuesta JSON

```json
{
  "temperature": 25.5,
  "humidity": 65,
  "soilHumidity": 45,
  "bulbOn": false,
  "ventTempOn": true,
  "ventHumOn": false,
  "pumpOn": false,
  "remote1On": false,
  "remote2On": true,
  "setpointTemp": 24.0,
  "setpointHum": 70.0
}
```

## 🎮 Controles

### Actuadores Automáticos (Indicadores)

- **Bombilla de Calefacción**: Se enciende automáticamente cuando la temperatura está por debajo del setpoint
- **Ventilador de Temperatura**: Se enciende automáticamente cuando la temperatura está por encima del setpoint
- **Ventilador de Humedad**: Se enciende automáticamente para controlar la humedad del aire
- **Bomba de Agua**: Se enciende automáticamente cuando la humedad del suelo está baja

### Controles Manuales

- **Control Remoto 1** (ID: 47): Control manual independiente
- **Control Remoto 2** (ID: 49): Control manual independiente

### Referencias (Setpoints)

- **Temperatura**: Rango 0-50°C, controla la activación de bombilla y ventilador
- **Humedad**: Rango 0-100%, controla la activación del ventilador de humedad

## 📊 Sensores

- **Temperatura**: Muestra la temperatura actual del invernadero
- **Humedad del Aire**: Muestra la humedad relativa del aire
- **Humedad del Suelo**: Muestra el nivel de humedad del suelo

## 🎨 Características de la Interfaz

- **Diseño responsivo** que se adapta a diferentes tamaños de pantalla
- **Animaciones CSS** para indicadores de actuadores (bombilla parpadea, ventilador gira, bomba pulsa)
- **Efectos hover** en todas las tarjetas
- **Notificaciones elegantes** para feedback del usuario
- **Actualización automática** cada 2 segundos
- **Actualizaciones optimistas** para mejor experiencia de usuario
- **Indicadores de estado** con colores y iconos intuitivos

## 🔍 Solución de Problemas

### Problemas de Conexión

1. **Verificar IP del Arduino**
   - Usar el panel de configuración para cambiar la IP
   - Probar la conexión antes de guardar

2. **Error de CORS**
   - El Arduino debe incluir headers CORS en sus respuestas
   - Verificar que el código del Arduino incluya los headers necesarios

3. **Timeout de conexión**
   - Aumentar el timeout en la configuración
   - Verificar que el Arduino esté respondiendo

### Problemas de Control

1. **Actuadores no responden**
   - Verificar que los IDs de actuadores sean correctos
   - Comprobar que el Arduino esté procesando los comandos

2. **Latencia en controles manuales**
   - La aplicación usa actualizaciones optimistas para mejor UX
   - Los cambios se confirman automáticamente en la siguiente actualización

## 🚀 Despliegue

### Netlify

1. Conectar el repositorio a Netlify
2. Configurar las variables de entorno en Netlify
3. El build se ejecutará automáticamente

### Variables de Entorno en Producción

En Netlify, configurar:
- `REACT_APP_ARDUINO_IP`
- `REACT_APP_ARDUINO_PORT`
- `REACT_APP_API_TIMEOUT`

## 📝 Licencia

MIT License

## 👨‍💻 Autor

Sistema de Control de Invernadero - Desarrollado con React y Arduino

---

**Nota**: Asegúrate de que el Arduino esté configurado correctamente y que la IP en el archivo `.env` coincida con la IP asignada a tu dispositivo Arduino. 