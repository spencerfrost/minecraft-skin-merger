import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import * as skinview3d from 'skinview3d';

const SkinViewer3D = ({ skinUrl }) => {
  const canvasRef = useRef(null);
  const skinViewer = useRef(null);

  useEffect(() => {
    if (canvasRef.current && skinUrl) {
      if (skinViewer.current) {
        skinViewer.current.dispose();
      }

      skinViewer.current = new skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width: 600,
        height: 800,
        skin: skinUrl
      });

      // Add animation
      skinViewer.current.animation = new skinview3d.WalkingAnimation();
      skinViewer.current.animation.speed = 0.6;

      // Set initial camera position
      skinViewer.current.camera.position.set(30, 0, 0);
      skinViewer.current.camera.lookAt(0, 0, 0);
      // Enable auto rotate
      skinViewer.current.autoRotate = false;

      // Zoom out
      skinViewer.current.zoom = 0.9;

      // Adjust lighting for better visibility
      skinViewer.current.globalLight.intensity = 2;
      skinViewer.current.cameraLight.intensity = 1.8;

      // Set a light background color
      skinViewer.current.background = 0xeeeeee;
    }

    return () => {
      if (skinViewer.current) {
        skinViewer.current.dispose();
      }
    };
  }, [skinUrl]);

  return <canvas ref={canvasRef} />;
};

SkinViewer3D.propTypes = {
  skinUrl: PropTypes.string.isRequired,
};

export default SkinViewer3D;