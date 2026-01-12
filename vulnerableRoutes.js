const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const router = express.Router();

// VULNERABILIDAD: Prototype Pollution
router.post('/set-config', (req, res) => {
    const key = req.body.key;
    const value = req.body.value;
    
    // Vulnerable to prototype pollution
    const config = {};
    config[key] = value;
    
    res.json({ message: 'Config updated', config: config });
});

// VULNERABILIDAD: Unsafe reflection
router.post('/call-method', (req, res) => {
    const methodName = req.body.method;
    const obj = {
        getData: () => "data",
        getUser: () => "user"
    };
    
    // Unsafe reflection - can call any method
    const result = obj[methodName]();
    res.json({ result: result });
});

// VULNERABILIDAD: Open Redirect
router.get('/redirect', (req, res) => {
    const url = req.query.url;
    // No validation of redirect URL
    res.redirect(url);
});

// VULNERABILIDAD: Server-Side Request Forgery (SSRF)
router.get('/fetch-url', (req, res) => {
    const url = req.query.url;
    const https = require('https');
    
    // SSRF - fetches any URL
    https.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            res.send(data);
        });
    }).on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
});

// VULNERABILIDAD: Unvalidated file upload
router.post('/upload-avatar', (req, res) => {
    const filename = req.body.filename;
    const content = req.body.content;
    
    // No validation of file type or content
    fs.writeFileSync('/tmp/' + filename, content);
    res.json({ message: 'Avatar uploaded', path: '/tmp/' + filename });
});

// VULNERABILIDAD: Arbitrary file write
router.post('/save-file', (req, res) => {
    const path = req.body.path;
    const content = req.body.content;
    
    // Can write to any file on the system
    fs.writeFileSync(path, content);
    res.json({ message: 'File saved' });
});

// VULNERABILIDAD: Directory listing
router.get('/list-dir', (req, res) => {
    const dir = req.query.dir || '.';
    
    // Lists any directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ files: files });
    });
});

// VULNERABILIDAD: Race condition in temp file
router.post('/create-temp', (req, res) => {
    const data = req.body.data;
    const tempFile = '/tmp/temp_' + Date.now() + '.txt';
    
    // Predictable temp file name - race condition
    fs.writeFileSync(tempFile, data);
    
    // Simulate processing
    setTimeout(() => {
        const content = fs.readFileSync(tempFile, 'utf8');
        fs.unlinkSync(tempFile);
        res.json({ processed: content });
    }, 1000);
});

// VULNERABILIDAD: Information disclosure
router.get('/debug', (req, res) => {
    // Exposes internal system information
    res.json({
        env: process.env,
        cwd: process.cwd(),
        version: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage()
    });
});

module.exports = router;
