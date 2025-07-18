const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;
const MBTA_HOST = 'https://www.mbta.com';
app.use(express.static(path.join(__dirname, 'public')));
app.use('/proxy/mbta', createProxyMiddleware({
  target: MBTA_HOST,
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/mbta': MBTA_HOST,
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
app.use('/', [
  /* Hack to get MBTA.com's assets from the correct host */
  /* Also ensures links to /alerts/* use correct host */
  createProxyMiddleware({
    target: MBTA_HOST,
    changeOrigin: true,
    ws: true,
    pathFilter: ['/js','/css', '/favicon.ico', '/fonts', '/alerts', '/socket'],
    onProxyRes: function (proxyRes) {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
    }
  })
]);


app.use('/proxy/mbta-github', createProxyMiddleware({
  target: 'https://mbta.github.io/gm_dashboard',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/mbta-github': '',
  },
  onProxyRes: function (proxyRes) {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
