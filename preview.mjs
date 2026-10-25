import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const files = new Set(['index.html', 'app.js', 'demo.js', 'app.css', 'widget.js']);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/api/config' && req.method === 'GET') { res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({mode:'demo'})); return; }
  if (pathname === '/api/chat') { res.writeHead(503, {'Content-Type':'application/json'}); res.end(JSON.stringify({message:'This local preview uses sample replies only.'})); return; }
  const name = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (req.method !== 'GET' || !files.has(name)) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(path.join(root,name)); res.writeHead(200, {'Content-Type':types[path.extname(name)]}); res.end(body); }
  catch { res.writeHead(500); res.end('Preview file unavailable'); }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('CSH assistant preview: http://127.0.0.1:' + server.address().port));
