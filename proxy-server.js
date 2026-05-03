const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 5000;
const API_TARGET = 'https://api.abdallah-ghazal.cloud';
const EXPO_TARGET = 'http://localhost:5001';

app.use(
  '/api',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.setHeader('origin', API_TARGET);
      },
      error: (err, req, res) => {
        console.error('[API proxy error]', err.message);
        res.status(502).json({ message: 'API proxy error', error: err.message });
      },
    },
  }),
);

app.use(
  '/',
  createProxyMiddleware({
    target: EXPO_TARGET,
    changeOrigin: true,
    ws: true,
    on: {
      error: (err, req, res) => {
        console.error('[Expo proxy error]', err.message);
      },
    },
  }),
);

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
  console.log(`  /api/* → ${API_TARGET}`);
  console.log(`  /*     → ${EXPO_TARGET} (Expo web)`);
});
