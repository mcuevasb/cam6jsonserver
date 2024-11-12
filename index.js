const http = require('http');
const fs = require('fs');
const url = require('url');

// Lee y almacena el contenido del archivo JSON
let data = [];
fs.readFile('./data.json', 'utf-8', (err, content) => {
    if (err) {
        console.error("Error al leer el archivo JSON:", err);
    } else {
        try {
            data = JSON.parse(content);
        } catch (parseError) {
            console.error("Error al analizar el JSON:", parseError);
        }
    }
});

// Crea el servidor HTTP
const server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;

    // Configura las cabeceras de CORS y JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');  // Permite el acceso desde cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Cabeceras permitidas

    if (req.method === 'OPTIONS') {
        // Responde a las solicitudes OPTIONS (preflight)
        res.writeHead(204);
        res.end();
        return;
    }

    if (queryObject.id) {
        const result = data.find(record => record.id === queryObject.id);
        if (result) {
            res.writeHead(200);
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Registro no encontrado" }));
        }
    } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Debe proporcionar un id" }));
    }
});

// Inicia el servidor en el puerto 3000
server.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
