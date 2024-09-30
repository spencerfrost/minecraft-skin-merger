import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import * as skinview3d from "skinview3d";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
        width: 500,
        height: 500,
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
  }, [skinUrl]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Interactive 3D Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-1 bg-black">
        <canvas ref={canvasRef} />
      </CardContent>
    </Card>
  );
};

SkinViewer3D.propTypes = {
  skinUrl: PropTypes.string.isRequired,
};

export default SkinViewer3D;