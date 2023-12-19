const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');
const crypto = require('crypto');

const proxy = httpProxy.createProxyServer({
    agent: new https.Agent({
        rejectUnauthorized: false,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
});

const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: 'https://hoadondientu.gdt.gov.vn:30000' });
});

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain',
    });
    res.end('Proxy error');
});

server.listen(8080, () => {
    console.log('Proxy server is running on http://localhost:8080');
});