const http = require('http');
const path = require('path');
const { handleApiRoutes } = require('./routes/api');
const { serveFile } = require('./utils/http');

const PORT = process.env.PORT || 3000;
const frontendRoot = path.join(__dirname, '../../frontend/public');

function resolveFrontendFile(pathname) {
  if (pathname === '/' || pathname === '/index.html') {
    return path.join(frontendRoot, 'index.html');
  }

  const sanitizedPath = pathname.replace(/^\/+/, '');
  const candidate = path.normalize(path.join(frontendRoot, sanitizedPath));

  if (!candidate.startsWith(frontendRoot)) {
    return null;
  }

  return candidate;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  const wasHandledByApi = await handleApiRoutes(req, res, url);
  if (wasHandledByApi) {
    return;
  }

  if (req.method === 'GET') {
    const filePath = resolveFrontendFile(url.pathname);
    if (filePath) {
      serveFile(res, filePath);
      return;
    }
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`CanadaCitizenTest.ca demo server listening on http://localhost:${PORT}`);
});
