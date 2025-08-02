#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

// --- Configuración Wi-Fi ---
const char* ssid     = "Parrilla Y Sazon AP";
const char* password = "1053827199";

ESP8266WebServer server(80);
MDNSResponder mdns;

// --- Setpoints (iniciales) ---
float setpointTemp = 40.0;
float setpointHum  = 70.0;

// --- Variables de estado recibidas de la Mega ---
float temperature   = NAN;
int   humidity      = -1;
int   soilHumidity  = -1;
bool  bulbOn        = false;
bool  ventTempOn    = false;
bool  ventHumOn     = false;
bool  pumpOn        = false;
bool  remote1On     = false;  // pin 47
bool  remote2On     = false;  // pin 49

String rawLine = "";

// Función para agregar headers CORS
void addCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

// Maneja las peticiones OPTIONS (preflight)
void handleOptions() {
  addCORSHeaders();
  server.send(200, "text/plain", "");
}

// Parsea la línea "[t:23.4,h:56,…,r2:0]"
void parseSensorLine(const String &line) {
  String s = line;
  s.replace("[",""); s.replace("]","");
  int idx = 0;
  while (idx < s.length()) {
    int comma = s.indexOf(',', idx);
    String token = (comma == -1 ? s.substring(idx) : s.substring(idx, comma));
    int colon = token.indexOf(':');
    if (colon > 0) {
      String key = token.substring(0, colon);
      String val = token.substring(colon + 1);
      if (key=="t")   temperature  = val.toFloat();
      if (key=="h")   humidity     = val.toInt();
      if (key=="hs")  soilHumidity = val.toInt();
      if (key=="bl")  bulbOn       = (val=="1");
      if (key=="vt")  ventTempOn   = (val=="1");
      if (key=="vh")  ventHumOn    = (val=="1");
      if (key=="bb")  pumpOn       = (val=="1");
      if (key=="r1")  remote1On    = (val=="1");
      if (key=="r2")  remote2On    = (val=="1");
    }
    if (comma == -1) break;
    idx = comma + 1;
  }
}

// Construye el JSON de /datos
String buildJson(){
  String j = "{";
  j += "\"temperature\":" + String(temperature,1) + ",";
  j += "\"humidity\":"    + String(humidity)    + ",";
  j += "\"soilHumidity\":" + String(soilHumidity) + ",";
  j += "\"bulbOn\":"       + String(bulbOn ? "true":"false") + ",";
  j += "\"ventTempOn\":"   + String(ventTempOn ? "true":"false") + ",";
  j += "\"ventHumOn\":"    + String(ventHumOn ? "true":"false") + ",";
  j += "\"pumpOn\":"       + String(pumpOn ? "true":"false") + ",";
  j += "\"remote1On\":"    + String(remote1On ? "true":"false") + ",";
  j += "\"remote2On\":"    + String(remote2On ? "true":"false") + ",";
  j += "\"setpointTemp\":" + String(setpointTemp,1) + ",";
  j += "\"setpointHum\":"  + String(setpointHum,1);
  j += "}";
  return j;
}

// Página principal: control y display
void handleRoot(){
  String page = R"rawliteral(
    <!DOCTYPE html><html lang="es">
    <head><meta charset="utf-8"><title>Control y Monitoreo</title></head>
    <body>
      <h1>Control y Monitoreo</h1>

      <fieldset><legend>Actuadores remotos</legend>
        <button onclick="cmd('ON47')">Remoto 47 ON</button>
        <button onclick="cmd('OFF47')">Remoto 47 OFF</button>
        <button onclick="cmd('ON49')">Remoto 49 ON</button>
        <button onclick="cmd('OFF49')">Remoto 49 OFF</button>
      </fieldset>

      <fieldset><legend>Setpoints</legend>
        <label>Temp (°C): <input id="spT" type="number" step="0.1"></label>
        <button onclick="setSP('temp')">Actualizar</button><br>
        <label>Hum (%):   <input id="spH" type="number" step="0.1"></label>
        <button onclick="setSP('hum')">Actualizar</button>
      </fieldset>

      <h2>Datos actuales</h2>
      <pre id="data">Cargando…</pre>

      <script>
        function fetchData(){
          fetch('/datos')
            .then(r=>r.json())
            .then(j=>{
              document.getElementById('data').textContent = JSON.stringify(j,null,2);
              document.getElementById('spT').value = j.setpointTemp;
              document.getElementById('spH').value = j.setpointHum;
            });
        }
        function cmd(c){
          fetch('/cmd/'+c).then(_=>setTimeout(fetchData,300));
        }
        function setSP(type){
          let v = document.getElementById(type=='temp'?'spT':'spH').value;
          fetch('/setpoint/'+type+'/'+v).then(_=>setTimeout(fetchData,300));
        }
        setInterval(fetchData,2000);
        fetchData();
      </script>
    </body>
    </html>
  )rawliteral";
  addCORSHeaders();
  server.send(200, "text/html", page);
}

// Devuelve JSON de datos
void handleDatos(){
  addCORSHeaders();
  server.send(200, "application/json", buildJson());
}

void setup(){
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status()!=WL_CONNECTED){
    delay(250); Serial.print('.');
  }
  Serial.println(); Serial.print("IP: "); Serial.println(WiFi.localIP());
  mdns.begin("esp8266", WiFi.localIP());

  // Configurar endpoints con CORS
  server.on("/", HTTP_GET, handleRoot);
  server.on("/datos", HTTP_GET, handleDatos);
  
  // Agregar manejo de OPTIONS para CORS
  server.on("/", HTTP_OPTIONS, handleOptions);
  server.on("/datos", HTTP_OPTIONS, handleOptions);

  // 'Catch-all' para /cmd/… y /setpoint/…
  server.onNotFound([](){
    String uri = server.uri(); 
    
    // Agregar CORS headers a todas las respuestas
    addCORSHeaders();
    
    if (uri.startsWith("/cmd/")) {
      // /cmd/ON47, /cmd/OFF49, etc.
      String c = uri.substring(5);
      Serial.println("[" + c + "]");
      server.send(204);
      return;
    }
    else if (uri.startsWith("/setpoint/")) {
      // /setpoint/temp/45.5  ó  /setpoint/hum/60.0
      int p = uri.indexOf('/', 10);
      if (p>0){
        String t = uri.substring(10, p);
        String v = uri.substring(p+1);
        float f = v.toFloat();
        if (t=="temp"){
          setpointTemp = f;
          Serial.println("[SPT:" + String(f,1) + "]");
        } else if (t=="hum") {
          setpointHum = f;
          Serial.println("[SPH:" + String(f,1) + "]");
        }
        server.send(204);
        return;
      }
    }
    server.send(404, "text/plain", "Not found");
  });

  server.begin();
  Serial.println("Servidor HTTP iniciado con CORS habilitado");
}

void loop(){
  server.handleClient();
  if (Serial.available()){
    rawLine = Serial.readStringUntil('\n');
    rawLine.trim();
    if (rawLine.startsWith("[") && rawLine.endsWith("]")){
      parseSensorLine(rawLine);
      Serial.print("Recibido: "); Serial.println(rawLine);
    }
  }
} 