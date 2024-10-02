import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import config from "../config/config.js";

const regions = {
  Head: { left: 0, top: 0, width: 32, height: 16 },
  Hat: { left: 32, top: 0, width: 32, height: 16 },
  Body: { left: 16, top: 16, width: 24, height: 16 },
  Jacket: { left: 16, top: 32, width: 24, height: 16 },
  "Left Arm": { left: 32, top: 48, width: 16, height: 16 },
  "Left Sleeve": { left: 48, top: 48, width: 16, height: 16 },
  "Right Arm": { left: 40, top: 16, width: 16, height: 16 },
  "Right Sleeve": { left: 40, top: 32, width: 16, height: 16 },
  "Left Leg": { left: 16, top: 48, width: 16, height: 16 },
  "Left Pant": { left: 0, top: 48, width: 16, height: 16 },
  "Right Leg": { left: 0, top: 16, width: 16, height: 16 },
  "Right Pant": { left: 0, top: 32, width: 16, height: 16 },
};

export default async function mergeSkins(req, res) {
  try {
    let selectedParts;
    try {
      selectedParts = JSON.parse(req.body.selectedParts);
    } catch (parseError) {
      console.error("Error parsing selectedParts:", parseError);
      return res.status(400).json({ error: "Invalid selectedParts data" });
    }

    const skins = req.files;

    if (!selectedParts || typeof selectedParts !== 'object') {
      console.error("Invalid selectedParts data:", selectedParts);
      return res.status(400).json({ error: "Invalid selectedParts data" });
    }

    if (!skins || skins.length === 0) {
      return res.status(400).json({ error: "No skin files uploaded" });
    }

    // Create a mapping between skin indices and uploaded files
    const skinMap = new Map();
    skins.forEach((skin, index) => {
      const originalIndex = parseInt(skin.originalname.replace(/\D/g, ''));
      skinMap.set(originalIndex, skin);
    });

    const mergedSkin = sharp({
      create: {
        width: 64,
        height: 64,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const compositeOperations = [];

    for (const [part, skinIndex] of Object.entries(selectedParts)) {
      const skin = skinMap.get(skinIndex);
      if (skin && regions[part]) {
        const { left, top, width, height } = regions[part];
        try {
          const extractedPart = await sharp(skin.path)
            .extract({ left, top, width, height })
            .toBuffer();

          compositeOperations.push({
            input: extractedPart,
            left,
            top,
          });
        } catch (extractError) {
          console.error(
            `Error extracting part ${part} from skin ${skinIndex}:`,
            extractError
          );
        }
      } else {
        console.error(`No valid region or skin file found for part: ${part}`);
      }
    }

    const mergedSkinBuffer = await mergedSkin
      .composite(compositeOperations)
      .png()
      .toBuffer();

    const outputFileName = `merged-skin-${Date.now()}.png`;
    const outputPath = path.join(config.PUBLIC_DIR, outputFileName);

    await fs.mkdir(config.PUBLIC_DIR, { recursive: true });
    await fs.writeFile(outputPath, mergedSkinBuffer);

    const mergedSkinUrl = `/public/${outputFileName}`;
    res.json({ mergedSkinUrl });

  } catch (error) {
    console.error("Error merging skins:", error);
    res.status(500).json({ error: "Failed to merge skins", message: error.message });
  } finally {
    if (req.files) {
      await Promise.all(
        req.files.map((skin) =>
          fs.unlink(skin.path).catch((err) =>
            console.error(`Failed to delete file ${skin.path}:`, err)
          )
        )
      );
    }
  }
}