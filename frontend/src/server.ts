import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { Readable } from 'node:stream';
import type { ReadableStream as WebReadableStream } from 'node:stream/web';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

/** Where this server reaches the NestJS API (private network URL in production). */
const apiInternalUrl = (process.env['API_INTERNAL_URL'] ?? 'http://localhost:3000/api').replace(/\/$/, '');

const app = express();
app.disable('x-powered-by');
const angularApp = new AngularNodeAppEngine();

/**
 * Same-origin API proxy: the browser always calls /api, so the backend never
 * has to be exposed on a second domain and no CORS setup is needed.
 */
app.use('/api', async (req, res, next) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined || key === 'host' || key === 'connection') continue;
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
    headers.set('x-forwarded-for', req.ip ?? '');
    headers.set('x-forwarded-proto', req.protocol);

    const hasBody = !['GET', 'HEAD'].includes(req.method);
    const upstream = await fetch(apiInternalUrl + req.url, {
      method: req.method,
      headers,
      body: hasBody ? (Readable.toWeb(req) as unknown as BodyInit) : undefined,
      // Required by Node when streaming a request body.
      ...(hasBody ? { duplex: 'half' } : {}),
      redirect: 'manual',
    } as RequestInit);

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key)) {
        res.setHeader(key, value);
      }
    });
    if (upstream.body) Readable.fromWeb(upstream.body as WebReadableStream).pipe(res);
    else res.end();
  } catch (error) {
    next(error);
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  if (process.env['TRUST_PROXY'] === 'true') app.set('trust proxy', 1);
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
