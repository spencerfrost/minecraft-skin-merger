import path from "path";
import { fileURLToPath } from "url";

const isDev = process.env.NODE_ENV !== "production";

const PROD_DOMAIN = "https://mcskinmerger.mrspinn.ca";
const DEFAULT_PORT = isDev ? 3020 : 3220;
const PORT = process.env.PORT || DEFAULT_PORT;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = isDev
  ? path.join(__dirname, "..", "..", "public") 
  : path.join(__dirname, "public");

const corsOptions = {
  origin: isDev ? /^http:\/\/localhost:\d+$/ : PROD_DOMAIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default {
  PORT,
  isDev,
  DOMAIN: isDev ? `http://localhost:${PORT}` : PROD_DOMAIN,
  PUBLIC_DIR,
  corsOptions,
};
