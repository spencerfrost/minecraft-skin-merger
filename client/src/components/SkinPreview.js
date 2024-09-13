import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const SkinPreview = ({ skins, selectedParts }) => {
  const canvasRef = useRef(null);

  const bodyParts = {
    Head: { x: 8, y: 8, w: 8, h: 8, dx: 48, dy: 0, dw: 96, dh: 96 },
    Body: { x: 20, y: 20, w: 8, h: 12, dx: 48, dy: 96, dw: 96, dh: 144 },
    Hat: { x: 40, y: 8, w: 8, h: 8, dx: 48, dy: 0, dw: 96, dh: 96 },
    Jacket: { x: 20, y: 36, w: 8, h: 12, dx: 48, dy: 96, dw: 96, dh: 144 },
    "Left Arm": { x: 36, y: 52, w: 4, h: 12, dx: 144, dy: 96, dw: 48, dh: 144 },
    "Right Arm": { x: 44, y: 20, w: 4, h: 12, dx: 0, dy: 96, dw: 48, dh: 144 },
    "Left Leg": { x: 20, y: 52, w: 4, h: 12, dx: 96, dy: 240, dw: 48, dh: 144 },
    "Right Leg": { x: 4, y: 20, w: 4, h: 12, dx: 48, dy: 240, dw: 48, dh: 144 },
    "Left Sleeve": { x: 52, y: 52, w: 4, h: 12, dx: 144, dy: 96, dw: 48, dh: 144 },
    "Right Sleeve": { x: 44, y: 36, w: 4, h: 12, dx: 0, dy: 96, dw: 48, dh: 144 },
    "Left Pant": { x: 4, y: 52, w: 4, h: 12, dx: 96, dy: 240, dw: 48, dh: 144 },
    "Right Pant": { x: 4, y: 36, w: 4, h: 12, dx: 48, dy: 240, dw: 48, dh: 144 },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load all skin images
    const skinImages = skins.map(skinUrl => {
      if (!skinUrl) return null;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = skinUrl;
      return img;
    });

    // Wait for all images to load
    Promise.all(skinImages.map(img => img ? new Promise(resolve => img.onload = resolve) : null))
      .then(() => {
        // Draw selected parts
        Object.entries(selectedParts).forEach(([part, skinIndex]) => {
          if (skinIndex !== null && skinImages[skinIndex]) {
            const { x, y, w, h, dx, dy, dw, dh } = bodyParts[part];
            
            // Create a temporary canvas for pixel-perfect scaling
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.imageSmoothingEnabled = false;

            // Draw the part on the temporary canvas
            tempCtx.drawImage(skinImages[skinIndex], x, y, w, h, 0, 0, w, h);

            // Scale up the temporary canvas to the main canvas
            ctx.drawImage(tempCanvas, 0, 0, w, h, dx, dy, dw, dh);
          }
        });
      });
  }, [skins, selectedParts, bodyParts]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <canvas
        ref={canvasRef}
        width={192}
        height={384}
        className="border border-gray-300 pixelated"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

SkinPreview.propTypes = {
  skins: PropTypes.arrayOf(PropTypes.string),
  selectedParts: PropTypes.object
};

export default SkinPreview;