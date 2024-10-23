import path from 'path';
import { fileURLToPath } from 'url';

// Constants
const PROD_DOMAIN = 'https://mcskinmerger.mrspinn.ca';
const DEFAULT_PORT = 3002;

// Environment
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || DEFAULT_PORT;

// File paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');

// CORS
const corsOptions = {
  origin: isDev ? /^http:\/\/localhost:\d+$/ : PROD_DOMAIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default {
  PORT,
  isDev,
  DOMAIN: isDev ? `http://localhost:${PORT}` : PROD_DOMAIN,
  PUBLIC_DIR,
  corsOptions
};