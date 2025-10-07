// server.js

// 1. Cargar variables de entorno del archivo .env
// Esto debe hacerse al principio para que las variables estén disponibles.
require('dotenv').config();

// 2. Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas para código asíncrono más limpio
const cors = require('cors'); // Para manejar Cross-Origin Resource Sharing

// 3. Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || 5000; // El puerto en el que correrá tu backend, por defecto 5000

// 4. Configurar middleware
app.use(cors()); // Habilita CORS para permitir peticiones desde tu app React
app.use(express.json()); // Habilita Express para parsear cuerpos de petición JSON (para cuando se envíen datos)

// 5. Configurar la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '8bitesdios2704', // ¡Es muy importante que uses tu contraseña real aquí!
    database: process.env.DB_NAME || 'MistCatcher_database',
    port: process.env.DB_PORT || 3307 // Puerto por defecto de MySQL/MariaDB
};

let connection; // Variable para almacenar la conexión a la DB

// Función para intentar conectar a la base de datos
async function connectDB() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexión exitosa a la base de datos MariaDB/MySQL.');
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        // Si la conexión a la DB es crítica, puedes salir del proceso
        // process.exit(1); 
    }
}

// Llamar a la función de conexión al iniciar el servidor
connectDB();

// 6. Definir las rutas (API Endpoints)

// Ruta de prueba: para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor backend MistCatcher funcionando!');
});

// Ruta para recibir datos (POST request)
// Este endpoint será llamado por el programa en tu computadora que lee el Arduino.
app.post('/api/measurements', async (req, res) => {
    const { temperature, humidity, water_collected } = req.body;

    // Validar datos básicos
    if (temperature === undefined || humidity === undefined || water_collected === undefined) {
        return res.status(400).json({ message: 'Faltan datos de medición (temperature, humidity, water_collected).' });
    }

    try {
        // Asegurarse de que la conexión a la DB exista
        if (!connection || connection.state === 'disconnected') { // Añadimos chequeo de estado
            await connectDB(); // Intentar reconectar si se perdió la conexión
            if (!connection || connection.state === 'disconnected') {
                return res.status(500).json({ message: 'No hay conexión activa a la base de datos.' });
            }
        }

        const query = 'INSERT INTO measurements (temperature, humidity, water_collected) VALUES (?, ?, ?)';
        const [result] = await connection.execute(query, [temperature, humidity, water_collected]);

        console.log('Datos insertados:', { id: result.insertId, temperature, humidity, water_collected, timestamp: new Date() });
        res.status(201).json({ message: 'Medición guardada exitosamente.', id: result.insertId });
    } catch (error) {
        console.error('Error al guardar la medición:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar la medición.' });
    }
});

// Ruta para obtener las últimas X mediciones (para gráficas o visualización)
// Ejemplo: GET /api/measurements?limit=10
app.get('/api/measurements', async (req, res) => {
    const limit = parseInt(req.query.limit) || 100; // Por defecto, obtener las últimas 100 mediciones
    const orderBy = req.query.orderBy || 'timestamp'; // Ordenar por 'timestamp' por defecto
    const orderDir = req.query.orderDir === 'asc' ? 'ASC' : 'DESC'; // Dirección del orden

    try {
        if (!connection || connection.state === 'disconnected') {
            await connectDB();
            if (!connection || connection.state === 'disconnected') {
                return res.status(500).json({ message: 'No hay conexión activa a la base de datos.' });
            }
        }

        const query = `SELECT * FROM measurements ORDER BY ${orderBy} ${orderDir} LIMIT ?`;
        const [rows] = await connection.execute(query, [limit]);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las mediciones:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las mediciones.' });
    }
});

// Ruta para obtener la última medición
app.get('/api/latest-measurement', async (req, res) => {
    try {
        if (!connection || connection.state === 'disconnected') {
            await connectDB();
            if (!connection || connection.state === 'disconnected') {
                return res.status(500).json({ message: 'No hay conexión activa a la base de datos.' });
            }
        }

        const query = 'SELECT * FROM measurements ORDER BY timestamp DESC LIMIT 1';
        const [rows] = await connection.execute(query);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontraron mediciones.' });
        }
    } catch (error) {
        console.error('Error al obtener la última medición:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la última medición.' });
    }
});


// 7. Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
});