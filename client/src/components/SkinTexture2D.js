import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const SkinTexture2D = ({ skinUrl }) => {
  const [imageError, setImageError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    console.log('SkinTexture2D: Attempting to load image from URL:', skinUrl);
    
    // Test the URL with a fetch request
    fetch(skinUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } 
        return response.blob();
      })
      .then(blob => {
        console.log('SkinTexture2D: Fetch successful, content type:', blob.type);
      })
      .catch(e => {
        console.error('SkinTexture2D: Fetch error:', e);
        setImageError(`Fetch error: ${e.message}`);
      });
  }, [skinUrl]);

  const handleImageError = (e) => {
    console.error('SkinTexture2D: Error loading image:', e);
    setImageError(`Load error: ${e.type}`);
  };

  const handleImageLoad = () => {
    console.log('SkinTexture2D: Image loaded successfully');
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div className="border border-gray-300 p-2 bg-white text-red-500">
        Error loading skin texture: {imageError}
      </div>
    );
  }

  return (
    <div className="border border-gray-300 p-2 bg-white">
      {!imageLoaded && <div>Loading...</div>}
      <img 
        src={skinUrl} 
        alt="Skin Texture" 
        className={`w-full h-auto ${imageLoaded ? '' : 'hidden'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
      />
    </div>
  );
};

SkinTexture2D.propTypes = {
  skinUrl: PropTypes.string.isRequired,
};

export default SkinTexture2D;