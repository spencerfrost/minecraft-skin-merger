const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });


const PORT = process.env.PORT || 3002;
const isDev = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: isDev ? 'http://localhost:3000' : 'https://mcskinmerger.mrspinn.ca',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


const regions = {
  'Head': { left: 0, top: 0, width: 32, height: 16 },
  'Hat': { left: 32, top: 0, width: 32, height: 16 },
  'Body': { left: 16, top: 16, width: 24, height: 16 },
  'Jacket': { left: 16, top: 32, width: 24, height: 16 },
  'Left Arm': { left: 32, top: 48, width: 16, height: 16 },
  'Left Sleeve': { left: 48, top: 48, width: 16, height: 16 },
  'Right Arm': { left: 40, top: 16, width: 16, height: 16 },
  'Right Sleeve': { left: 40, top: 32, width: 16, height: 16 },
  'Left Leg': { left: 16, top: 48, width: 16, height: 16 },
  'Left Pant': { left: 0, top: 48, width: 16, height: 16 },
  'Right Leg': { left: 0, top: 16, width: 16, height: 16 },
  'Right Pant': { left: 0, top: 32, width: 16, height: 16 }
};

app.post('/api/merge-skins', upload.array('skins', 4), async (req, res) => {
  console.log('Received request:', {
    body: req.body,
    files: req.files ? req.files.map(f => f.filename) : 'No files'
  });

  try {
    let selectedParts = JSON.parse(req.body.selectedParts);
    console.log('Parsed selectedParts:', selectedParts);

    const skins = req.files;

    if (!skins || skins.length === 0) {
      return res.status(400).json({ error: 'No skin files uploaded' });
    }

    // Create a blank canvas for the merged skin
    const mergedSkin = sharp({
      create: {
        width: 64,
        height: 64,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    const compositeOperations = [];

    for (const [part, skinIndex] of Object.entries(selectedParts)) {
      const skin = skins[skinIndex];
      if (skin && regions[part]) {
        const { left, top, width, height } = regions[part];
        const extractedPart = await sharp(skin.path)
          .extract({ left, top, width, height })
          .toBuffer();
        
        compositeOperations.push({
          input: extractedPart,
          left,
          top
        });
      }
    }

    // Apply all composite operations at once
    await mergedSkin.composite(compositeOperations);

    const outputFileName = `merged-skin-${Date.now()}.png`;
    const outputPath = path.join(__dirname, 'public', outputFileName);
    await mergedSkin.png().toFile(outputPath);

    // Clean up uploaded files
    skins.forEach(skin => fs.unlinkSync(skin.path));

    const mergedSkinUrl = `${DOMAIN}/${outputFileName}`;

    console.log('Sending response:', { mergedSkinUrl });
    res.json({ mergedSkinUrl });
  } catch (error) {
    console.error('Error merging skins:', error);
    res.status(500).json({ error: 'Failed to merge skins' });
  }
});

if (!isDev) {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running in ${isDev ? 'development' : 'production'} mode on port ${PORT}`);
});