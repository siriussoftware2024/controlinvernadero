# 🌱 Control de Invernadero

Sistema de monitoreo y control inteligente para invernaderos desarrollado con React y Tailwind CSS.

## 🚀 Características

- **Monitoreo en tiempo real** de sensores de temperatura, humedad del aire y suelo
- **Control de actuadores** con switches interactivos
- **Configuración de referencias** para temperatura y humedad
- **Indicadores de estado** con colores según los valores de los sensores
- **Interfaz responsiva** que funciona en dispositivos móviles y de escritorio
- **Actualización automática** cada 5 segundos
- **Indicador de conexión** con el sistema Arduino

## 📊 Sensores Monitoreados

- **Temperatura**: Control automático con bombilla de calefacción y ventilador
- **Humedad del Aire**: Control con ventilador de humedad
- **Humedad del Suelo**: Control con bomba de agua para riego automático

## ⚡ Actuadores Controlados

- **Bombilla de Calefacción** (ID: 47) - Control de temperatura
- **Ventilador de Temperatura** (ID: 49) - Enfriamiento
- **Ventilador de Humedad** (ID: 51) - Control de humedad del aire
- **Bomba de Agua** (ID: 53) - Riego automático
- **Control Remoto 1** (ID: 55) - Actuador adicional
- **Control Remoto 2** (ID: 57) - Actuador adicional

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework de JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **Axios** - Cliente HTTP para las peticiones a la API
- **Netlify** - Plataforma de despliegue

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd control-invernadero
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la URL del Arduino**
   
   Edita el archivo `src/services/api.js` y cambia la variable `API_BASE_URL` con la IP de tu Arduino:
   ```javascript
   const API_BASE_URL = 'http://192.168.2.14'; // Cambia por tu IP
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

   La aplicación se abrirá en `http://localhost:3000`

## 🚀 Despliegue en Netlify

### Opción 1: Despliegue automático desde GitHub

1. **Subir el código a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conectar con Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Crea una cuenta o inicia sesión
   - Haz clic en "New site from Git"
   - Selecciona tu repositorio de GitHub
   - Configura las opciones de build:
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
   - Haz clic en "Deploy site"

### Opción 2: Despliegue manual

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Subir a Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `build` al área de despliegue
   - Tu sitio estará disponible en una URL de Netlify

## 🔧 Configuración del Arduino

Asegúrate de que tu Arduino esté configurado con los siguientes endpoints:

### Endpoints de Sensores
- `GET /datos` - Obtiene todos los datos de los sensores

### Endpoints de Control
- `GET /cmd/ON{id}` - Enciende un actuador
- `GET /cmd/OFF{id}` - Apaga un actuador

### Endpoints de Configuración
- `GET /setpoint/temp/{valor}` - Establece referencia de temperatura
- `GET /setpoint/hum/{valor}` - Establece referencia de humedad

## 📱 Uso de la Aplicación

### Monitoreo de Sensores
- Los valores de los sensores se actualizan automáticamente cada 5 segundos
- Los colores de las tarjetas indican el estado:
  - 🟢 Verde: Valores normales
  - 🟡 Amarillo: Valores de advertencia
  - 🔴 Rojo: Valores críticos

### Control de Actuadores
- Usa los switches para encender/apagar los actuadores
- El estado se actualiza inmediatamente en la interfaz
- Los actuadores se controlan mediante los IDs configurados

### Configuración de Referencias
- Usa los sliders para ajustar las referencias de temperatura y humedad
- También puedes escribir el valor directamente en el campo numérico
- Los cambios se envían automáticamente al Arduino

## 🔒 Consideraciones de Seguridad

- La aplicación está diseñada para uso en redes locales
- Considera implementar autenticación para uso en producción
- Asegúrate de que tu Arduino tenga las medidas de seguridad apropiadas

## 🐛 Solución de Problemas

### Error de conexión
- Verifica que la IP del Arduino sea correcta
- Asegúrate de que el Arduino esté en la misma red
- Comprueba que los endpoints estén funcionando

### Problemas de CORS
- Si tienes problemas de CORS, considera usar un proxy o configurar el Arduino para permitir peticiones desde tu dominio
- **Solución inmediata**: El proyecto incluye un proxy configurado en `package.json` que resuelve problemas de CORS en desarrollo
- **Solución permanente**: Configura CORS en tu Arduino (ver archivo `arduino-cors-setup.md`)
- **Verificación**: Usa el componente de prueba de conexión que aparece en modo desarrollo

### Valores no se actualizan
- Verifica la conexión de red
- Revisa la consola del navegador para errores
- Comprueba que el Arduino esté respondiendo correctamente

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerir mejoras.

## 📞 Soporte

Si tienes problemas o preguntas, puedes:
- Abrir un issue en GitHub
- Contactar al desarrollador

---

**Desarrollado con ❤️ para el control inteligente de invernaderos** 