import cors from "cors";
import express from "express";
import path from "path";

import config from "./config/config.js";
import routes from "./routes/routes.js";

const app = express();

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving with detailed logging
app.use(
  "/public",
  (req, res, next) => {
    const fullPath = path.join(config.PUBLIC_DIR, req.url);
    next();
  },
  express.static(config.PUBLIC_DIR)
);

// Use the routes
app.use(routes);

// Start server
app.listen(config.PORT, () => {
  console.log(
    `Server is running in ${
      config.isDev ? "development" : "production"
    } mode on ${config.DOMAIN}`
  );
  console.log(`Serving static files from: ${config.PUBLIC_DIR}`);
});