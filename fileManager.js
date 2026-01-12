const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// VULNERABILIDAD: Insecure file operations
class FileManager {
    // VULNERABILIDAD: Path Traversal en múltiples métodos
    static readFile(filename) {
        // No valida la ruta - permite acceso a archivos del sistema
        const filePath = '/var/data/' + filename;
        return fs.readFileSync(filePath, 'utf8');
    }

    static writeFile(filename, content) {
        // No valida la ruta ni el contenido
        const filePath = '/var/data/' + filename;
        fs.writeFileSync(filePath, content);
    }

    static deleteFile(filename) {
        // Usa exec en lugar de fs.unlink - Command Injection
        const command = 'rm -f /var/data/' + filename;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error deleting file:', error);
            }
        });
    }

    // VULNERABILIDAD: Insecure temporary file creation
    static createTempFile(data) {
        // Nombre predecible - race condition
        const tmpFile = '/tmp/temp_' + Date.now() + '.txt';
        fs.writeFileSync(tmpFile, data);
        return tmpFile;
    }

    // VULNERABILIDAD: Directory listing sin control de acceso
    static listDirectory(dir) {
        const fullPath = path.join('/var/data', dir);
        return fs.readdirSync(fullPath);
    }

    // VULNERABILIDAD: File upload sin validación
    static uploadFile(filename, content) {
        // No valida extensión ni contenido del archivo
        const uploadPath = '/var/uploads/' + filename;
        fs.writeFileSync(uploadPath, content);
        return uploadPath;
    }
}

// VULNERABILIDAD: XXE (XML External Entity)
const parseXML = (xmlString) => {
    // Simula parser XML vulnerable
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser({
        // Configuración insegura que permite XXE
        explicitCharkey: true
    });
    
    return parser.parseString(xmlString);
};

module.exports = {
    FileManager,
    parseXML
};
