import { resolve, join } from 'node:path';
import { statSync } from 'node:fs';
import app from './dist/server/server.js';

const clientDir = resolve(process.cwd(), 'dist/client');

export default {
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const pathName = url.pathname;
    
    // 1. Try to serve a static file from dist/client
    if (pathName !== '/') {
      try {
        const filePath = join(clientDir, pathName);
        // Ensure the path is safely within clientDir to prevent directory traversal
        if (filePath.startsWith(clientDir) && statSync(filePath).isFile()) {
          return new Response(Bun.file(filePath));
        }
      } catch (e) {
        // File doesn't exist, ignore and fallback to SSR
      }
    }

    // 2. Fallback to TanStack SSR handler
    const handler = app.default?.fetch || app.fetch;
    return handler(req);
  }
};
