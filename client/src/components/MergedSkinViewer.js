import PropTypes from 'prop-types';
import SkinTexture2D from './SkinTexture2D';
import SkinViewer3D from './SkinViewer3D';
import { Button } from './ui/button';

const MergedSkinViewer = ({ mergedSkin }) => {
  const fullSkinUrl = mergedSkin.startsWith('http')
    ? mergedSkin
    : `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3002'}${mergedSkin}`;

  const DOMAIN = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3002';

  const handleDownload = () => {
    const filename = mergedSkin.split('/').pop();
    const downloadUrl = `${DOMAIN}/download/${filename}`;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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