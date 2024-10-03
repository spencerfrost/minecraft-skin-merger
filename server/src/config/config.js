import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3002;
const isDev = process.env.NODE_ENV !== 'production';
const DOMAIN = isDev ? `http://localhost:${PORT}` : 'https://mcskinmerger.mrspinn.ca';

const config = {
  PORT,
  isDev,
  DOMAIN,
  PUBLIC_DIR: path.join(__dirname, '..', '..', 'public'),
  corsOptions: {
    origin: isDev ? 'http://localhost:3000' : 'https://mcskinmerger.mrspinn.ca',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};

export default config;