import PropTypes from 'prop-types';
import SkinTexture2D from './SkinTexture2D';
import SkinViewer3D from './SkinViewer3D';

const MergedSkinViewer = ({ mergedSkin }) => (
  <div className="mt-4">
    <h2 className="text-xl font-bold mb-2">Merged Skin</h2>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/2">
        <h3 className="text-lg font-semibold mb-2">2D Texture</h3>
        <SkinTexture2D skinUrl={mergedSkin} />
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
