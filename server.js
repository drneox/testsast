const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vulnerableRoutes = require('./vulnerableRoutes');

const app = express();
const PORT = 3000;

// VULNERABILIDAD: Credenciales hardcodeadas
const DB_PASSWORD = "admin123";
const API_KEY = "sk-1234567890abcdef";
const SECRET_TOKEN = "my-secret-token-12345";

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Usar rutas vulnerables adicionales
app.use('/api', vulnerableRoutes);

// Inicializar base de datos
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)");
    db.run("INSERT INTO users (username, password, email) VALUES ('admin', 'admin123', 'admin@example.com')");
    db.run("INSERT INTO users (username, password, email) VALUES ('user1', 'password1', 'user1@example.com')");
});

// VULNERABILIDAD 1: SQL Injection
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // Consulta SQL vulnerable - concatenación directa
    const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
    
    db.get(query, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.json({ success: false, message: "Credenciales inválidas" });
        }
    });
});

// VULNERABILIDAD: SQL Injection adicional con exec
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    // SQL injection vulnerable
    db.all("SELECT * FROM users WHERE id = " + userId, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: rows });
    });
});

// VULNERABILIDAD 2: Cross-Site Scripting (XSS)
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    
    // Renderiza directamente sin escapar - XSS reflejado
    const html = `
        <html>
        <head><title>Búsqueda</title></head>
        <body>
            <h1>Resultados de búsqueda</h1>
            <p>Has buscado: ${searchTerm}</p>
            <p>No se encontraron resultados.</p>
        </body>
        </html>
    `;
    
    res.send(html);
});

// VULNERABILIDAD 3: Command Injection
app.post('/ping', (req, res) => {
    const host = req.body.host;
    
    // Ejecución de comando sin validación
    exec('ping -c 4 ' + host, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ output: stdout });
    });
});

// VULNERABILIDAD: Command Injection adicional
app.get('/system-info', (req, res) => {
    const command = req.query.cmd;
    // Command injection directa
    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ result: stdout });
    });
});

// VULNERABILIDAD 4: Path Traversal
app.get('/download', (req, res) => {
    const filename = req.query.file;
    
    // Lectura de archivo sin validación de ruta
    const filePath = path.join(__dirname, 'files', filename);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('Archivo no encontrado');
            return;
        }
        res.send(data);
    });
});

// VULNERABILIDAD 5: Weak Cryptography
app.post('/encrypt', (req, res) => {
    const text = req.body.text;
    
    // Uso de algoritmo débil MD5
    const hash = crypto.createHash('md5').update(text).digest('hex');
    
    // Uso de DES (algoritmo obsoleto)
    const cipher = crypto.createCipher('des', 'weak-key');
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    res.json({ 
        md5Hash: hash,
        desEncrypted: encrypted
    });
});

// VULNERABILIDAD 6: Insecure Deserialization
app.post('/deserialize', (req, res) => {
    const data = req.body.data;
    
    // eval() es extremadamente peligroso
    try {
        const result = eval('(' + data + ')');
        res.json({ result: result });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// VULNERABILIDAD 7: Información sensible en logs
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    
    // Log con información sensible
    console.log(`Nuevo registro - Usuario: ${username}, Password: ${password}, Email: ${email}`);
    
    db.run("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", 
        [username, password, email], 
        (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: "Usuario registrado" });
        }
    );
});

// VULNERABILIDAD 8: Missing Authentication
app.get('/admin/users', (req, res) => {
    // Endpoint sin autenticación que expone datos sensibles
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: rows });
    });
});

// VULNERABILIDAD 9: Regex Denial of Service (ReDoS)
app.post('/validate-email', (req, res) => {
    const email = req.body.email;
    
    // Expresión regular vulnerable a ReDoS
    const emailRegex = /^([a-zA-Z0-9]+)+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    
    const isValid = emailRegex.test(email);
    res.json({ valid: isValid });
});

// VULNERABILIDAD 10: Insecure Random
app.get('/generate-token', (req, res) => {
    // Uso de Math.random() para tokens de seguridad
    const token = Math.random().toString(36).substring(2);
    
    res.json({ token: token });
});

// Página principal
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><title>Aplicación Vulnerable</title></head>
        <body>
            <h1>Aplicación con Vulnerabilidades Conocidas</h1>
            <p><strong>ADVERTENCIA:</strong> Esta aplicación contiene vulnerabilidades intencionales para propósitos educativos.</p>
            <h2>Endpoints principales:</h2>
            <ul>
                <li>POST /login - SQL Injection</li>
                <li>GET /user/:id - SQL Injection (numeric)</li>
                <li>GET /search?q= - XSS</li>
                <li>POST /ping - Command Injection</li>
                <li>GET /system-info?cmd= - Command Injection directo</li>
                <li>GET /download?file= - Path Traversal</li>
                <li>POST /encrypt - Weak Cryptography</li>
                <li>POST /deserialize - Insecure Deserialization</li>
                <li>POST /register - Información sensible en logs</li>
                <li>GET /admin/users - Missing Authentication</li>
                <li>POST /validate-email - ReDoS</li>
                <li>GET /generate-token - Insecure Random</li>
            </ul>
            <h2>Endpoints adicionales (bajo /api):</h2>
            <ul>
                <li>POST /api/set-config - Prototype Pollution</li>
                <li>GET /api/redirect?url= - Open Redirect</li>
                <li>GET /api/fetch-url?url= - SSRF</li>
                <li>POST /api/save-file - Arbitrary File Write</li>
                <li>GET /api/list-dir?dir= - Directory Listing</li>
                <li>GET /api/debug - Information Disclosure</li>
            </ul>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor vulnerable ejecutándose en http://localhost:${PORT}`);
    console.log('ADVERTENCIA: Esta aplicación contiene vulnerabilidades intencionales');
    console.log('NO USAR EN PRODUCCIÓN');
});
