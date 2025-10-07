import serial
import requests
import time

# --- Configuración del puerto serial del Arduino ---
# Asegúrate de que el COM Port sea el correcto para tu Arduino.
# En Windows, será algo como 'COM3', 'COM4', etc.
# En macOS/Linux, será algo como '/dev/ttyACM0' o '/dev/ttyUSB0'.
SERIAL_PORT = 'COM4'  # <--- ¡ASEGÚRATE DE QUE ESTE ES EL PUERTO CORRECTO DE TU ARDUINO!
BAUD_RATE = 9600      # Debe coincidir con el Serial.begin() en tu código Arduino

# --- Configuración de la URL de tu Backend ---
# Tu backend Express.js está escuchando en http://localhost:5000
BACKEND_URL = 'http://localhost:5000/api/measurements'

def read_from_arduino_and_send_to_backend():
    ser = None  # Inicializamos ser como None para manejar errores de conexión
    try:
        print(f"Intentando conectar al Arduino en {SERIAL_PORT} a {BAUD_RATE} baudios...")
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)  # Espera un poco para que la conexión serial se establezca
        print("Conexión serial establecida. Leyendo datos...")

        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                print(f"Línea recibida del Arduino: {line}")

                # Buscamos la línea que empieza con "DATA:"
                if line.startswith("DATA:"):
                    data_string = line[len("DATA:"):] # Quita el prefijo "DATA:"
                    parts = data_string.split(',') # Divide la cadena por comas

                    if len(parts) == 3:
                        try:
                            # Convierte los datos a los tipos correctos
                            temperature = float(parts[0])
                            humidity = float(parts[1])
                            water_collected = float(parts[2])

                            # Prepara el payload JSON para enviar al backend
                            payload = {
                                "temperature": temperature,
                                "humidity": humidity,
                                "water_collected": water_collected
                            }

                            print(f"Enviando datos al backend: {payload}")

                            # Envía la petición POST al backend
                            response = requests.post(BACKEND_URL, json=payload)

                            if response.status_code == 201:
                                print("Datos enviados exitosamente al backend.")
                            else:
                                print(f"Error al enviar datos. Código de estado: {response.status_code}, Respuesta: {response.text}")

                        except ValueError as e:
                            print(f"Error al parsear los datos numéricos: {e}. Línea: {data_string}")
                        except requests.exceptions.ConnectionError:
                            print("Error de conexión con el backend. Asegúrate de que el servidor Express.js está corriendo.")
                        except Exception as e:
                            print(f"Error inesperado al procesar y enviar datos: {e}")
                    else:
                        print(f"Formato de datos incorrecto después de 'DATA:': {data_string}")
                #else:
                    #print("Línea no de datos (ignorado).") # Puedes descomentar para ver todas las líneas

            time.sleep(0.1) # Pequeño delay para no sobrecargar la CPU

    except serial.SerialException as e:
        print(f"Error de comunicación serial: {e}")
        print(f"Asegúrate de que el Arduino está conectado al {SERIAL_PORT} y el Monitor Serial del IDE de Arduino está cerrado.")
    except Exception as e:
        print(f"Ocurrió un error general: {e}")
    finally:
        if ser and ser.is_open:
            ser.close()
            print("Conexión serial cerrada.")

if __name__ == "__main__":
    print("Iniciando script de lectura de Arduino...")
    read_from_arduino_and_send_to_backend()