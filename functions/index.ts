import { onRequest } from 'firebase-functions/v2/https';
import { createServer } from 'node:http';
import next from 'next';

const app = next({ dev: false, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();
const server = createServer((req, res) => handle(req, res));

export const nextApp = onRequest(
  { region: 'asia-southeast1' },
  async (req, res) => {
    await app.prepare();
    server.emit('request', req, res);
  }
);
