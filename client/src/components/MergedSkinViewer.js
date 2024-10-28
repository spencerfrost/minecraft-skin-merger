import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import SkinTexture2D from './SkinTexture2D';
import SkinViewer3D from './SkinViewer3D';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const MergedSkinViewer = ({ mergedSkin }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const fullSkinUrl = mergedSkin.startsWith('http')
    ? mergedSkin
    : `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3002'}${mergedSkin}`;
    
  const DOMAIN = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3002';

  useEffect(() => {
    setIsLoading(true);
    setIsImageLoaded(false);

    // Preload the image
    const img = new Image();
    img.src = fullSkinUrl;
    img.onload = () => {
      setIsImageLoaded(true);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [fullSkinUrl]);

  const handleDownload = () => {
    const filename = mergedSkin.split('/').pop();
    const downloadUrl = `${DOMAIN}/download/${filename}`;
   
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading && !isImageLoaded) {
    return (
      <div className="mt-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-text-white mb-4" />
            <p className="font-minecraft text-text-white text-shadow-minecraft">
              Generating Your Custom Skin...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/2 flex flex-col">
          <SkinTexture2D skinUrl={fullSkinUrl} />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <SkinViewer3D skinUrl={fullSkinUrl} />
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Button onClick={handleDownload}>
          Download Merged Skin
        </Button>
      </div>
    </div>
  );
};

MergedSkinViewer.propTypes = {
  mergedSkin: PropTypes.string.isRequired,
};

export default MergedSkinViewer;