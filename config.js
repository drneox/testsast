// Archivo de configuración con más vulnerabilidades

// VULNERABILIDAD: Hardcoded database credentials
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Pa$$w0rd123!',
    database: 'production_db',
    port: 3306
};

// VULNERABILIDAD: AWS credentials hardcoded
const awsConfig = {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region: 'us-east-1'
};

// VULNERABILIDAD: API keys and tokens (INTENTIONAL - For educational purposes only)
// These are example patterns that demonstrate insecure credential storage
const apiKeys = {
    stripeKey: 'sk_test_' + 'ExampleKeyForEducationalPurposes123',
    twilioToken: 'AC' + 'ExampleTwilioTokenForDemo1234567890',
    googleApiKey: 'AIza' + 'ExampleGoogleKeyForSecurityClass123'
};

// VULNERABILIDAD: JWT secret hardcoded
const jwtSecret = 'super-secret-jwt-key-12345';

// VULNERABILIDAD: Encryption key hardcoded
const encryptionKey = '0123456789abcdef0123456789abcdef';

module.exports = {
    dbConfig,
    awsConfig,
    apiKeys,
    jwtSecret,
    encryptionKey
};
