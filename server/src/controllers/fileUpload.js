import fs from 'fs';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

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
    const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);

    // Process and save the image
    await sharp(req.file.buffer)
      .png() // Convert to PNG
      .resize(64, 64, { fit: 'fill' }) // Ensure correct size for Minecraft skin
      .toFile(filePath);

    res.json({ fileName });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
}

// This function should be called when the server starts
export function setupFileCleanup() {
  setInterval(() => {
    const directory = path.join(__dirname, '..', '..', 'uploads');
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.stat(path.join(directory, file), (err, stat) => {
          if (err) throw err;

          const now = new Date().getTime();
          const endTime = new Date(stat.ctime).getTime() + 3600000; // 1 hour

          if (now > endTime) {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) throw err;
              console.log(`Deleted ${file}`);
            });
          }
        });
      }
    });
  }, 3600000); // Run every hour
}