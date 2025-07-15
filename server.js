const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use('/proxy/mbta', createProxyMiddleware({
  target: 'https://www.mbta.com',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/mbta': '',
  },
  onProxyRes: function (proxyRes) {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));
app.use('/proxy/swiftly', createProxyMiddleware({
  target: 'https://dashboard.goswift.ly',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/swiftly': '',
  },
  onProxyRes: function (proxyRes) {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
