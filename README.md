# Aplicación con Vulnerabilidades Conocidas

## ⚠️ ADVERTENCIA
Esta aplicación contiene **vulnerabilidades de seguridad intencionales** con fines educativos para demostrar cómo GitHub Advanced Security puede detectarlas. 

**NUNCA usar este código en producción.**

## Descripción
Esta es una aplicación Node.js/Express creada específicamente para demostrar vulnerabilidades comunes que pueden ser detectadas por herramientas de análisis de seguridad como GitHub Advanced Security (CodeQL) y Dependabot.

## Requisitos
- Node.js 14 o superior
- npm

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm start
```

La aplicación se ejecutará en `http://localhost:3000`

## Vulnerabilidades Incluidas

### 1. SQL Injection (CWE-89)
**Endpoint:** `POST /login`

**Descripción:** La consulta SQL concatena directamente la entrada del usuario sin parametrización.

**Ejemplo de exploit:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' OR '\''1'\''='\''1", "password": "anything"}'
```

**Ubicación en código:** `server.js` líneas 36-52

---

### 2. Cross-Site Scripting (XSS) - CWE-79
**Endpoint:** `GET /search?q=`

**Descripción:** La entrada del usuario se renderiza directamente en HTML sin escapar.

**Ejemplo de exploit:**
```bash
curl "http://localhost:3000/search?q=<script>alert('XSS')</script>"
```

**Ubicación en código:** `server.js` líneas 54-72

---

### 3. Command Injection (CWE-78)
**Endpoint:** `POST /ping`

**Descripción:** Ejecuta comandos del sistema operativo con entrada del usuario sin validación.

**Ejemplo de exploit:**
```bash
curl -X POST http://localhost:3000/ping \
  -H "Content-Type: application/json" \
  -d '{"host": "127.0.0.1; ls -la"}'
```

**Ubicación en código:** `server.js` líneas 74-87

---

### 4. Path Traversal (CWE-22)
**Endpoint:** `GET /download?file=`

**Descripción:** Permite leer archivos arbitrarios del sistema sin validación de ruta.

**Ejemplo de exploit:**
```bash
curl "http://localhost:3000/download?file=../../etc/passwd"
```

**Ubicación en código:** `server.js` líneas 89-104

---

### 5. Weak Cryptography (CWE-327)
**Endpoint:** `POST /encrypt`

**Descripción:** Usa algoritmos criptográficos débiles (MD5 y DES).

**Ubicación en código:** `server.js` líneas 106-123

---

### 6. Insecure Deserialization (CWE-502)
**Endpoint:** `POST /deserialize`

**Descripción:** Usa `eval()` para deserializar datos, permitiendo ejecución de código arbitrario.

**Ejemplo de exploit:**
```bash
curl -X POST http://localhost:3000/deserialize \
  -H "Content-Type: application/json" \
  -d '{"data": "require('\''child_process'\'').exec('\''whoami'\'')"}'
```

**Ubicación en código:** `server.js` líneas 125-137

---

### 7. Sensitive Data in Logs (CWE-532)
**Endpoint:** `POST /register`

**Descripción:** Registra contraseñas en texto plano en los logs.

**Ubicación en código:** `server.js` líneas 139-157

---

### 8. Missing Authentication (CWE-306)
**Endpoint:** `GET /admin/users`

**Descripción:** Endpoint administrativo sin autenticación que expone datos sensibles.

**Ubicación en código:** `server.js` líneas 159-170

---

### 9. Regular Expression Denial of Service (ReDoS) - CWE-1333
**Endpoint:** `POST /validate-email`

**Descripción:** Expresión regular vulnerable que puede causar consumo excesivo de CPU.

**Ubicación en código:** `server.js` líneas 172-182

---

### 10. Insecure Random (CWE-338)
**Endpoint:** `GET /generate-token`

**Descripción:** Usa `Math.random()` para generar tokens de seguridad (no criptográficamente seguro).

**Ubicación en código:** `server.js` líneas 184-191

---

### 11. Hardcoded Credentials (CWE-798)
**Descripción:** Contraseñas y tokens hardcodeados en el código fuente.

**Ubicación en código:** `server.js` líneas 12-14

---

### 12. Vulnerable Dependencies
**Descripción:** El `package.json` incluye versiones obsoletas con vulnerabilidades conocidas:
- `express` 4.17.1
- `lodash` 4.17.20 (múltiples CVEs)
- `ejs` 3.1.6

---

## Cómo GitHub Advanced Security Detecta las Vulnerabilidades

### CodeQL
CodeQL realizará análisis estático del código y detectará:
- SQL Injection
- XSS
- Command Injection
- Path Traversal
- Weak Cryptography
- Insecure Deserialization (uso de eval)
- Hardcoded secrets
- ReDoS
- Insecure Random

### Dependabot
Dependabot escaneará las dependencias y alertará sobre:
- Versiones vulnerables de paquetes npm
- CVEs conocidos en las dependencias

### Secret Scanning
Detectará:
- API keys hardcodeados
- Tokens y credenciales en el código

## Uso Educativo

Este proyecto está diseñado para:
1. Demostrar vulnerabilidades comunes en aplicaciones web
2. Mostrar cómo GitHub Advanced Security las detecta
3. Aprender sobre mejores prácticas de seguridad
4. Practicar la remediación de vulnerabilidades

## Cómo Remediar las Vulnerabilidades

### SQL Injection
✅ Usar consultas parametrizadas:
```javascript
db.get("SELECT * FROM users WHERE username = ? AND password = ?", 
    [username, password], callback);
```

### XSS
✅ Escapar la salida o usar templating engines seguros:
```javascript
const escaped = escapeHtml(searchTerm);
```

### Command Injection
✅ Validar entrada y usar APIs seguras en lugar de exec:
```javascript
// Validar que solo sea una IP o hostname válido
if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).json({ error: "Invalid host" });
}
```

### Path Traversal
✅ Validar y normalizar rutas:
```javascript
const safePath = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
```

### Weak Cryptography
✅ Usar algoritmos modernos:
```javascript
const hash = crypto.createHash('sha256').update(text).digest('hex');
```

### Insecure Deserialization
✅ Usar JSON.parse en lugar de eval:
```javascript
const result = JSON.parse(data);
```

### Hardcoded Credentials
✅ Usar variables de entorno:
```javascript
const API_KEY = process.env.API_KEY;
```

### Missing Authentication
✅ Implementar middleware de autenticación:
```javascript
const authenticate = (req, res, next) => {
    // Verificar token/sesión
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

app.get('/admin/users', authenticate, (req, res) => { ... });
```

## Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)
- [GitHub Advanced Security Documentation](https://docs.github.com/en/code-security)
- [CodeQL Documentation](https://codeql.github.com/docs/)

## Licencia
MIT - Solo para propósitos educativos

## Autor
Creado para clase de desarrollo seguro