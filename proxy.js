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
    if (req.method === 'OPTIONS') {
        enableCors(req, res);
        res.writeHead(200);
        res.end();
        return;
    }
    proxy.web(req, res, {
        target: 'https://hoadondientu.gdt.gov.vn:30000',
        secure: true,
        changeOrigin: true
    });
});

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain',
    });
    res.end('Proxy error');
});

const enableCors = (req, res) => {
    if (req.headers['access-control-request-method']) {
        res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
    }

    if (req.headers['access-control-request-headers']) {
        res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
    }

    if (req.headers.origin) {
        res.setHeader('access-control-allow-origin', req.headers.origin);
        res.setHeader('access-control-allow-credentials', 'true');
    }
};

proxy.on("proxyRes", function (proxyRes, req, res) {
    enableCors(req, res);
});

server.listen(8080, () => {
    console.log('Proxy server is running on http://localhost:8080');
});