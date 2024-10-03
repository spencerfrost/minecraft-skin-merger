import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { skinRegions } from "../constants/skinParts";
import { Card } from "./ui/card";

const SkinPreview = ({ skins, selectedParts }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load all skin images
    const skinImages = skins.map((skinUrl) => {
      if (!skinUrl) return null;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = skinUrl;
      return img;
    });

    // Wait for all images to load
    Promise.all(
      skinImages.map((img) =>
        img ? new Promise((resolve) => (img.onload = resolve)) : null
      )
    ).then(() => {
      // Draw selected parts
      Object.entries(selectedParts).forEach(([part, skinIndex]) => {
        if (skinIndex !== null && skinImages[skinIndex]) {
          const { x, y, w, h, dx, dy, dw, dh } = skinRegions[part];

          // Create a temporary canvas for pixel-perfect scaling
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = w;
          tempCanvas.height = h;
          const tempCtx = tempCanvas.getContext("2d");
          tempCtx.imageSmoothingEnabled = false;

          // Draw the part on the temporary canvas
          tempCtx.drawImage(skinImages[skinIndex], x, y, w, h, 0, 0, w, h);

          // Scale up the temporary canvas to the main canvas
          ctx.drawImage(tempCanvas, 0, 0, w, h, dx, dy, dw, dh);
        }
      });
    });
  }, [skins, selectedParts]);

  return (
    <Card className="h-full">
      <div className="bg-black h-full flex justify-center items-center relative p-4">
        <div className="absolute inset-0 border-t-2 border-l-2 gray" />
        <div className="absolute inset-0 border-b-2 border-r-2 border-white" />
        <canvas
          ref={canvasRef}
          width={192}
          height={384}
          style={{ imageRendering: "pixelated" }}
          data-testid="skin-preview-canvas"
        />
      </div>
    </Card>
  );
};

SkinPreview.propTypes = {
  skins: PropTypes.arrayOf(PropTypes.string),
  selectedParts: PropTypes.object,
};

export default SkinPreview;
