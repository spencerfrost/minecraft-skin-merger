import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";

import config from "./config/config.js";
import { setupFileCleanup } from "./controllers/fileUpload.js";
import routes from "./routes/routes.js";

const app = express();

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving with detailed logging and error handling
app.use(
  "/public",
  async (req, res, next) => {
    const fullPath = path.join(config.PUBLIC_DIR, req.url);
    try {
      await fs.access(fullPath);
    } catch (error) {
      console.error(`File not found: ${fullPath}`);
      return res.status(404).send('File not found');
    }
    
    next();
  },
  express.static(config.PUBLIC_DIR, {
    setHeaders: (res, path) => {
      if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      }
    }
  })
);

// Use the routes
app.use(routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

setupFileCleanup();

// Start server
app.listen(config.PORT, () => {
  console.log(
    `Server is running in ${
      config.isDev ? "development" : "production"
    } mode on ${config.DOMAIN}`
  );
  console.log(`Serving static files from: ${config.PUBLIC_DIR}`);
});