import app from './dist/server/server.js';

export default {
  port: process.env.PORT || 3000,
  fetch: app.default?.fetch || app.fetch
};
