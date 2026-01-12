# Guía para Instructores - Aplicación Vulnerable para Clase de Desarrollo Seguro

## Resumen Ejecutivo

Esta aplicación Node.js/Express fue creada específicamente para demostrar vulnerabilidades de seguridad comunes que pueden ser detectadas por GitHub Advanced Security. Es ideal para clases de desarrollo seguro.

## Vulnerabilidades Implementadas

### Vulnerabilidades de Código (Detectables por CodeQL)

1. **SQL Injection** (2 variantes)
   - `POST /login` - Inyección mediante concatenación de strings
   - `GET /user/:id` - Inyección numérica
   
2. **Cross-Site Scripting (XSS)**
   - `GET /search?q=` - XSS reflejado sin sanitización

3. **Command Injection** (2 variantes)
   - `POST /ping` - Ejecución de comandos mediante concatenación
   - `GET /system-info?cmd=` - Ejecución directa de comandos

4. **Path Traversal**
   - `GET /download?file=` - Lectura de archivos arbitrarios

5. **Insecure Deserialization**
   - `POST /deserialize` - Uso de eval()

6. **Weak Cryptography** (múltiples)
   - MD5 para hashing de passwords
   - SHA1 para tokens
   - DES para encriptación
   - ECB mode
   - IV predecible

7. **Insecure Random**
   - `GET /generate-token` - Uso de Math.random()

8. **Hardcoded Credentials**
   - Passwords, API keys, y tokens en el código fuente

9. **Open Redirect**
   - `GET /api/redirect?url=` - Redirección sin validación

10. **Server-Side Request Forgery (SSRF)**
    - `GET /api/fetch-url?url=` - Solicitudes HTTP arbitrarias

11. **Arbitrary File Write**
    - `POST /api/save-file` - Escritura de archivos en rutas arbitrarias

12. **Missing Authentication**
    - `GET /admin/users` - Endpoint administrativo sin autenticación

13. **Regular Expression Denial of Service (ReDoS)**
    - `POST /validate-email` - Regex vulnerable

14. **Information Disclosure**
    - `GET /api/debug` - Expone información del sistema

15. **Sensitive Data in Logs**
    - `POST /register` - Log de passwords en texto plano

### Vulnerabilidades de Dependencias (Detectables por Dependabot)

El archivo `package.json` incluye versiones obsoletas con 17 vulnerabilidades conocidas:
- express 4.17.1
- body-parser 1.19.0
- sqlite3 5.0.2
- ejs 3.1.6
- lodash 4.17.20

## Uso en Clase

### 1. Preparación del Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/drneox/testsast
cd testsast

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

### 2. Habilitar GitHub Advanced Security

Para repositorios privados:
1. Ve a `Settings` → `Security` → `Code security and analysis`
2. Habilita:
   - GitHub Advanced Security
   - CodeQL analysis
   - Dependabot alerts
   - Secret scanning

### 3. Actividades Sugeridas

#### Actividad 1: Descubrimiento de Vulnerabilidades
- **Objetivo**: Que los estudiantes identifiquen vulnerabilidades manualmente
- **Tarea**: Revisar el código y documentar vulnerabilidades encontradas
- **Tiempo**: 30-45 minutos

#### Actividad 2: Análisis con GitHub Advanced Security
- **Objetivo**: Aprender a usar herramientas de análisis automático
- **Tarea**: 
  1. Ejecutar CodeQL scan
  2. Revisar alertas en la pestaña Security
  3. Comparar con vulnerabilidades encontradas manualmente
- **Tiempo**: 30 minutos

#### Actividad 3: Explotación Controlada
- **Objetivo**: Comprender el impacto real de las vulnerabilidades
- **Tarea**: Ejecutar los exploits de ejemplo del README
- **Tiempo**: 45 minutos
- **Ejemplo SQL Injection**:
  ```bash
  curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{"username": "admin'\'' OR '\''1'\''='\''1", "password": "anything"}'
  ```

#### Actividad 4: Remediación
- **Objetivo**: Aprender a corregir vulnerabilidades
- **Tarea**: 
  1. Seleccionar 2-3 vulnerabilidades
  2. Implementar correcciones
  3. Verificar que CodeQL ya no las detecta
- **Tiempo**: 60 minutos

## Resultados Esperados

### CodeQL Detection
- Mínimo 12 alertas detectadas
- Categorías: missing-rate-limiting, redos, potential sql-injection, command-injection

### Dependabot Alerts
- 17 vulnerabilidades en dependencias
- Severidades: críticas, altas, moderadas, bajas

### npm audit
```
17 vulnerabilities (3 low, 2 moderate, 9 high, 3 critical)
```

## Recursos para Estudiantes

### Documentación
- README.md: Documentación completa con ejemplos
- Cada archivo de código incluye comentarios explicativos

### Referencias Externas
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)
- [GitHub Security Lab](https://securitylab.github.com/)
- [CodeQL Documentation](https://codeql.github.com/docs/)

## Advertencias Importantes

⚠️ **NUNCA usar este código en producción**

⚠️ **NO exponer esta aplicación a Internet**

⚠️ **Ejecutar solo en ambientes aislados de desarrollo**

## Estructura del Proyecto

```
.
├── .github/
│   ├── workflows/
│   │   └── codeql.yml          # Configuración de CodeQL
│   ├── codeql-config.yml       # Config avanzada de CodeQL
│   └── dependabot.yml          # Config de Dependabot
├── files/                      # Archivos de ejemplo
├── server.js                   # Servidor principal con vulnerabilidades
├── vulnerableRoutes.js         # Rutas adicionales vulnerables
├── config.js                   # Credenciales hardcodeadas
├── cryptoUtils.js              # Implementaciones criptográficas débiles
├── fileManager.js              # Operaciones de archivos inseguras
├── package.json                # Dependencias vulnerables
└── README.md                   # Documentación completa

```

## Preguntas Frecuentes

**P: ¿Por qué CodeQL no detecta todas las vulnerabilidades?**
R: CodeQL se enfoca en vulnerabilidades de alta confianza. Algunas vulnerabilidades requieren análisis dinámico o contexto adicional.

**P: ¿Cómo puedo agregar más vulnerabilidades?**
R: Revisa el código existente como ejemplo y agrega nuevos endpoints. Asegúrate de documentar en el README.

**P: ¿Puedo usar esto para otras herramientas además de GitHub?**
R: Sí, las vulnerabilidades son genéricas y pueden ser detectadas por otras herramientas SAST/DAST.

## Soporte

Para preguntas o problemas con esta aplicación educativa, abre un issue en el repositorio de GitHub.

---

**Versión**: 1.0.0  
**Última actualización**: 2026-01-12  
**Licencia**: MIT (Solo para propósitos educativos)
