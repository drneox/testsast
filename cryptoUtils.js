const crypto = require('crypto');

// VULNERABILIDAD: Multiple weak crypto implementations
class CryptoUtils {
    // VULNERABILIDAD: MD5 for password hashing
    static hashPassword(password) {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    // VULNERABILIDAD: SHA1 (deprecated)
    static generateToken(data) {
        return crypto.createHash('sha1').update(data).digest('hex');
    }

    // VULNERABILIDAD: Weak cipher algorithms
    static encryptData(data, key) {
        // DES es obsoleto y débil
        const cipher = crypto.createCipher('des', key);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decryptData(encryptedData, key) {
        const decipher = crypto.createDecipher('des', key);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    // VULNERABILIDAD: ECB mode (insecure)
    static encryptWithECB(data, key) {
        const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    // VULNERABILIDAD: Insufficient key length
    static generateWeakKey() {
        // Clave de solo 8 bytes (64 bits) - muy débil
        return crypto.randomBytes(8).toString('hex');
    }

    // VULNERABILIDAD: Predictable IV
    static encryptWithPredictableIV(data, key) {
        const iv = Buffer.from('1234567890123456'); // IV fijo - muy inseguro
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    // VULNERABILIDAD: Uso de Math.random() para crypto
    static generateSessionId() {
        return Math.random().toString(36).substring(2, 15) +
               Math.random().toString(36).substring(2, 15);
    }
}

module.exports = CryptoUtils;
