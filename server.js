// Serves the single-page site. No dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};
// Only these are public; server.js and package.json are never served.
const PUBLIC = /^\/(index\.html|logo\/[A-Za-z0-9._-]+\.(svg|png))$/;

http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/') url = '/index.html';
  if (!PUBLIC.test(url)) url = '/index.html'; // one-page site: everything else shows the page
  const file = path.join(ROOT, url);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': url === '/index.html' ? 'no-cache' : 'public, max-age=86400',
    });
    res.end(data);
  });
}).listen(PORT, () => console.log('UTNMA site running on port ' + PORT));
