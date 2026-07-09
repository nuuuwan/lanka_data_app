// Development-only proxy (used by `npm start`).
//
// The Lanka Data API (https://lanka-data-phi.vercel.app) does not send CORS
// headers, so the browser blocks cross-origin reads. During local development
// the CRA dev server proxies any request beginning with `/api` to the real
// API, stripping the prefix, so from the browser's point of view the request
// is same-origin and CORS never applies.
//
// This file is picked up automatically by react-scripts and has no effect on
// the production build. Production must rely on the API sending CORS headers.
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://lanka-data-phi.vercel.app",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    }),
  );
};
