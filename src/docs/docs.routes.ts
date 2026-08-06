import { Router } from 'express';
import express from 'express';
import path from 'node:path';
import swaggerUiDist from 'swagger-ui-dist';
import { openApiDocument } from './openapi.js';

export const docsRoutes = Router();

const swaggerAssetsPath = swaggerUiDist.absolutePath();

docsRoutes.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

docsRoutes.use('/assets', express.static(swaggerAssetsPath));

docsRoutes.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>SIVA API — Documentação</title>
    <link rel="stylesheet" href="assets/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="assets/swagger-ui-bundle.js"></script>
    <script src="assets/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '${path.posix.join('.', 'openapi.json')}',
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: 'StandaloneLayout',
        });
      };
    </script>
  </body>
</html>`);
});
