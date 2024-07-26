import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import config from "./config.js";

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
    let selectedParts = JSON.parse(req.body.selectedParts);
    const skins = req.files;

    if (!skins || skins.length === 0) {
      console.log("No skin files uploaded");
      return res.status(400).json({ error: "No skin files uploaded" });
    }

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
      const skin = skins[skinIndex];
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
        console.log(`No valid region or skin file found for part: ${part}`);
      }
    }

    try {
      const mergedSkinBuffer = await mergedSkin
        .composite(compositeOperations)
        .png() // Ensure output is PNG
        .toBuffer();

      const outputFileName = `merged-skin-${Date.now()}.png`;
      const outputPath = path.join(config.PUBLIC_DIR, outputFileName);

      await fs.mkdir(config.PUBLIC_DIR, { recursive: true });
      await fs.writeFile(outputPath, mergedSkinBuffer);

      const mergedSkinUrl = `/public/${outputFileName}`;
      res.json({ mergedSkinUrl });
    } catch (innerError) {
      console.error("Failed during composite or save operations:", innerError);
      res.status(500).json({
        error: "Failed during composite or save operations",
        message: innerError.message,
      });
    } finally {
      await Promise.all(
        skins.map((skin) =>
          fs
            .unlink(skin.path)
            .catch((err) =>
              console.error(`Failed to delete file ${skin.path}:`, err)
            )
        )
      );
    }
  } catch (error) {
    console.error("Error merging skins:", error);
    res
      .status(500)
      .json({ error: "Failed to merge skins", message: error.message });
  }
}
