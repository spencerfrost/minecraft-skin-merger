import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import fetchSkin from "./fetchSkin.js";
import mergeSkins from "./mergeSkins.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// Routes
router.post("/api/merge-skins", upload.array("skins", 4), mergeSkins);
router.get("/api/fetch-skin/:name", fetchSkin);

router.get("/download/:filename", (req, res) => {
  const filepath = path.join(config.PUBLIC_DIR, req.params.filename);
  console.log(`Attempting to download: ${filepath}`);
  res.download(filepath, (err) => {
    if (err) {
      console.error(`Error downloading file: ${err}`);
      res.status(404).send("File not found");
    }
  });
});

// Serve React app in production
if (!config.isDev) {
  const clientBuildPath = path.join(__dirname, "../client/build");
  router.use(express.static(clientBuildPath));
  router.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

export default router;