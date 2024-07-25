import PropTypes from 'prop-types';
import SkinTexture2D from './SkinTexture2D';
import SkinViewer3D from './SkinViewer3D';

function DownloadLink({ filename }) {
  // if in development env, use http://localhost:3002
  // if in production env, use the domain of the app
  const DOMAIN = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3002'; 
  const downloadUrl = `${DOMAIN}/download/${filename}`;

  return (
    <a href={downloadUrl} download className="block mt-2 p-2 bg-blue-500 text-white rounded-md text-center">
      Download Merged Skin
    </a>
  );
}

const MergedSkinViewer = ({ mergedSkin }) => (
  <div className="mt-4">
    <h2 className="text-xl font-bold mb-2">Merged Skin</h2>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/2">
        <h3 className="text-lg font-semibold mb-2">2D Texture</h3>
        <SkinTexture2D skinUrl={mergedSkin} />
        <DownloadLink filename={mergedSkin.split('/').pop()} />
      </div>
      <div className="md:w-1/2">
        <h3 className="text-lg font-semibold mb-2">3D Preview</h3>
        <SkinViewer3D skinUrl={mergedSkin} />
      </div>
    </div>
  </div>
);

MergedSkinViewer.propTypes = {
  mergedSkin: PropTypes.string.isRequired,
};

export default MergedSkinViewer;
