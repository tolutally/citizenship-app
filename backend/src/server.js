const http = require('http');
const path = require('path');
const { handleApiRoutes } = require('./routes/api');
const { serveFile } = require('./utils/http');

const PORT = process.env.PORT || 3000;
const frontendRoot = path.join(__dirname, '../../frontend/public');

const staticFiles = new Set(['/styles.css', '/app.js']);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  const wasHandledByApi = await handleApiRoutes(req, res, url);
  if (wasHandledByApi) {
    return;
  }

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    serveFile(res, path.join(frontendRoot, 'index.html'));
    return;
  }

  if (req.method === 'GET' && staticFiles.has(url.pathname)) {
    serveFile(res, path.join(frontendRoot, url.pathname));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`CanadaCitizenTest.ca demo server listening on http://localhost:${PORT}`);
});
