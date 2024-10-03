import fs from 'fs';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import config from '../config/config.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }
    cb(null, true);
  }
});

export const uploadSkin = upload.single('skin');

export async function processSkinUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
    const filePath = path.join(config.PUBLIC_DIR, 'uploads', fileName);

    // Process and save the image
    await sharp(req.file.buffer)
      .png()
      .resize(64, 64, { fit: 'fill' })
      .toFile(filePath);

    res.json({ fileName });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
}

export function setupFileCleanup() {
  const cleanupInterval = 3600000; // 1 hour
  const fileAge = 7200000; // 2 hours

  setInterval(async () => {
    const uploadsDir = path.join(config.PUBLIC_DIR, 'uploads');
    const mergedSkinsDir = path.join(config.PUBLIC_DIR, 'merged-skins');

    await cleanupDirectory(uploadsDir, fileAge);
    await cleanupDirectory(mergedSkinsDir, fileAge);
  }, cleanupInterval);
}

async function cleanupDirectory(directory, maxAge) {
  try {
    const files = await fs.promises.readdir(directory);
    const now = new Date().getTime();

    for (const file of files) {
      if (file === '.gitkeep') continue; // Skip .gitkeep file

      const filePath = path.join(directory, file);
      const stats = await fs.promises.stat(filePath);
      const endTime = new Date(stats.ctime).getTime() + maxAge;

      if (now > endTime) {
        await fs.promises.unlink(filePath);
        console.log(`Deleted ${file} from ${path.basename(directory)}`);
      }
    }
  } catch (error) {
    console.error(`Error cleaning up ${path.basename(directory)}:`, error);
  }
}