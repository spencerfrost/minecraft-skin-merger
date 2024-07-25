const path = require('path');

const PORT = process.env.PORT || 3002;
const isDev = process.env.NODE_ENV !== 'production';
const DOMAIN = isDev ? `http://localhost:${PORT}` : 'https://mcskinmerger.mrspinn.ca';

module.exports = {
  PORT,
  isDev,
  DOMAIN,
  corsOptions: {
    origin: isDev ? 'http://localhost:3000' : 'https://mcskinmerger.mrspinn.ca',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};
