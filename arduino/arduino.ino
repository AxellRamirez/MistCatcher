#include <Adafruit_Sensor.h> // Necesaria para la librería de sensor unificado de Adafruit
#include <DHT.h>             // La librería principal del sensor DHT
#include <DHT_U.h>           // Extensiones de la librería DHT para la unificada

#define DHTPIN A10    // Pin digital al que está conectado el sensor DHT11
#define DHTTYPE DHT11 // Define el tipo de sensor (DHT11, DHT22, o DHT21)

// Inicializa el sensor DHT. Nota: la clase es 'DHT' (mayúsculas)
// y se le pasa el pin y el tipo de sensor al constructor.
DHT dht(DHTPIN, DHTTYPE); 

const int sensorPin = A0; // Pin analógico para el sensor de nivel de agua (ej. YL-69 o similar)

// --- Calibración del sensor de agua ---
const int valorSeco = 150;  // Lectura del sensor cuando está en el aire/seco
const int valorMojado = 620; // Lectura del sensor cuando está completamente sumergido en agua

const int capacidadTotalMl = 340; // Capacidad total del recipiente en MILILITROS

void setup() {
  Serial.begin(9600); // Inicia la comunicación serial a 9600 baudios
  delay(100); 
  Serial.println("MistCatcher: Iniciando lectura de sensores...");
  dht.begin(); // Inicializa el sensor DHT
}

void loop() {
  // --- 1. LEER SENSOR DHT11 (Temperatura y Humedad) ---
  // Las lecturas del DHT pueden ser un poco lentas (250ms para DHT11).
  // Es bueno no leer muy rápido. El delay(5000) ya lo maneja.

  // Lee la temperatura en grados Celsius
  float temperatura = dht.readTemperature();
  // Lee la humedad en porcentaje relativo
  float humedad = dht.readHumidity();

  // Validar si los valores son razonables (evitar lecturas erróneas del DHT)
  if (isnan(temperatura) || isnan(humedad) || temperatura < -50 || temperatura > 100 || humedad < 0 || humedad > 100) {
    Serial.println("Error de lectura del sensor DHT11. Usando valores predeterminados.");
    temperatura = 0.0; // Valor predeterminado en caso de error
    humedad = 0.0;     // Valor predeterminado en caso de error
  }

  // --- 2. LEER SENSOR DE NIVEL DE AGUA ---
  int valorSensorAgua = analogRead(sensorPin); 

  int porcentajeAgua = map(valorSensorAgua, valorSeco, valorMojado, 0, 100);
  porcentajeAgua = constrain(porcentajeAgua, 0, 100);

  float mililitrosAgua = (float)(porcentajeAgua * capacidadTotalMl) / 100.0;
  if (mililitrosAgua < 0) mililitrosAgua = 0; // Asegurar que no sea negativo

  // --- 3. MENSAJES PARA EL MONITOR SERIAL (Solo para el usuario) ---
  Serial.print("🌡️ Temp: ");
  Serial.print(temperatura, 1); 
  Serial.println(" °C");

  Serial.print("💧 Humedad: ");
  Serial.print(humedad, 1); // Mostrar humedad con un decimal, ya que readHumidity devuelve float
  Serial.println(" %");

  Serial.print("🪣 Nivel Agua: ");
  Serial.print(porcentajeAgua);
  Serial.print("% (");
  Serial.print(mililitrosAgua, 1); 
  Serial.println(" ml)");

  if (porcentajeAgua < 20) {
    Serial.println("  ⚠️ Peligro: nivel muy bajo");
  } else if (porcentajeAgua < 50) {
    Serial.println("  🔵 Nivel medio");
  } else if (porcentajeAgua < 80) {
    Serial.println("  🟢 Nivel alto");
  } else {
    Serial.println("  ✅ Tanque lleno");
  }
  Serial.println("-------------------------------------");

  // --- 4. LÍNEA DE DATOS ESTRUCTURADA PARA EL SCRIPT DE PYTHON ---
  // Formato: TEMPERATURA,HUMEDAD,AGUA_RECOLECTADA_ML
  Serial.print("DATA:"); 
  Serial.print(temperatura, 1); 
  Serial.print(",");
  Serial.print(humedad, 1);       // Aseguramos que la humedad también sea float con un decimal
  Serial.print(",");
  Serial.print(mililitrosAgua, 1); 
  Serial.println(); 

  delay(5000); 
}