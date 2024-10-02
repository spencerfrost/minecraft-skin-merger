import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import * as skinview3d from "skinview3d";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const SkinViewer3D = ({ skinUrl }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const skinViewer = useRef(null);
  const [containerSize, setContainerSize] = useState(0);

  const updateContainerSize = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerSize(width);
    }
  };

  useEffect(() => {
    updateContainerSize();
    const resizeObserver = new ResizeObserver(updateContainerSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (canvasRef.current && skinUrl && containerSize > 0) {
      if (skinViewer.current) {
        skinViewer.current.dispose();
      }

      skinViewer.current = new skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width: containerSize,
        height: containerSize,
        skin: skinUrl,
      });

      skinViewer.current.animation = new skinview3d.WalkingAnimation();
      skinViewer.current.animation.speed = 0.6;
      skinViewer.current.camera.position.set(0, 0, 60);
      skinViewer.current.camera.lookAt(0, 0, 0);
      skinViewer.current.autoRotate = false;
      skinViewer.current.zoom = 0.9;
      skinViewer.current.globalLight.intensity = 2.8;
      skinViewer.current.cameraLight.intensity = 2;
      skinViewer.current.background = "#000000";
    }

    return () => {
      if (skinViewer.current) {
        skinViewer.current.dispose();
        skinViewer.current = null;
      }
    };
  }, [skinUrl, containerSize]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Interactive 3D Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-1 bg-black h-[calc(100%-2.5rem)]">
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ 
            aspectRatio: '1 / 1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <canvas 
            ref={canvasRef}
            width={containerSize}
            height={containerSize}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

SkinViewer3D.propTypes = {
  skinUrl: PropTypes.string.isRequired,
};

export default SkinViewer3D;