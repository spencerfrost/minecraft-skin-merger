import { useEffect, useState } from 'react';
import MergedSkinViewer from '../components/MergedSkinViewer';
import SkinPartSelector from '../components/SkinPartSelector';
import SkinUploader from '../components/SkinUploader';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3002/api';

const skinParts = [
  "Head",
  "Hat",
  "Body",
  "Jacket",
  "Left Arm",
  "Left Sleeve",
  "Right Arm",
  "Right Sleeve",
  "Left Leg",
  "Left Pant",
  "Right Leg",
  "Right Pant",
];

const MinecraftSkinMergerPage = () => {
  const [skins, setSkins] = useState([null, null, null, null]);
  const [skinImages, setSkinImages] = useState([null, null, null, null]);
  const [selectedParts, setSelectedParts] = useState({});
  const [mergedSkin, setMergedSkin] = useState(null);
  const [error, setError] = useState(null);

  const handleSkinUpload = (index, skin, image) => {
    const newSkins = [...skins];
    newSkins[index] = skin;
    setSkins(newSkins);
    setSkinImages([...skinImages.slice(0, index), image, ...skinImages.slice(index + 1)]);

    // If this is the first skin uploaded, set all parts to use this skin
    if (index === 0 && !skins[0]) {
      const newSelectedParts = {};
      skinParts.forEach((part) => {
        newSelectedParts[part] = 0;
      });
      setSelectedParts(newSelectedParts);
    }
  };

  const handleSkinDelete = (index) => {
    const newSkins = [...skins];
    newSkins[index] = null;
    setSkins(newSkins);
    setSkinImages([...skinImages.slice(0, index), null, ...skinImages.slice(index + 1)]);
    
    // If this is the last skin deleted, clear all selected parts
    if (newSkins.every((skin) => skin === null)) {
      setSelectedParts({});
    }
  };

  // This effect will run when skins change
  useEffect(() => {
    // If there's at least one skin uploaded and no parts are selected yet
    if (skins.some((skin) => skin !== null) && Object.keys(selectedParts).length === 0) {
      const firstSkinIndex = skins.findIndex((skin) => skin !== null);
      const newSelectedParts = {};
      skinParts.forEach((part) => {
        newSelectedParts[part] = firstSkinIndex;
      });
      setSelectedParts(newSelectedParts);
    }
  }, [skins]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePartSelection = (part, skinIndex) => {
    setSelectedParts({ ...selectedParts, [part]: skinIndex });
  };

  const mergeSkins = async () => {
    setError(null);
    const formData = new FormData();
  
    skins.forEach((skin, index) => {
      if (skin) {
        try {
          // Debugging: Log the skin data
          console.log(`Processing skin at index ${index}:`, skin);
  
          // Extract base64 data and MIME type
          const base64Data = skin.split(',')[1];
          const mimeString = skin.split(',')[0].split(':')[1].split(';')[0];
  
          // Decode base64 to binary data
          const byteString = atob(base64Data);
  
          // Convert binary string to typed array
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
  
          // Create blob from typed array
          const blob = new Blob([ab], { type: mimeString });
          formData.append('skins', blob, `skin${index}.png`);
  
        } catch (error) {
          console.error(`Error processing skin at index ${index}:`, error);
          // Optionally continue with next skin or handle error differently
        }
      }
    });
  
    // Append additional data
    formData.append('selectedParts', JSON.stringify(selectedParts));
  
    try {
      // Debugging: Log form submission attempt
      console.log('Attempting to submit form data:', formData);
  
      const response = await fetch(`${API_URL}/merge-skins`, {
        method: 'POST',
        body: formData,
      });
      const text = await response.text();
  
      // Debugging: Log server response
      console.log('Server response:', text);
  
      if (response.ok) {
        const data = JSON.parse(text);
        if (data.mergedSkinUrl) {
          setMergedSkin(data.mergedSkinUrl);
        } else {
          setError('Unexpected response format');
          console.error('Unexpected response format:', data);
        }
      } else {
        setError(`Error: ${response.status} ${response.statusText}`);
        console.error('Server responded with error:', text);
      }
    } catch (error) {
      setError('Error merging skins');
      console.error('Network or other error during merging skins:', error);
    }
  };  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minecraft Skin Merger</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {skins.map((skin, index) => (
          <SkinUploader
            key={`skinUploader-${skin ? skin.name : index}`}
            index={index}
            skin={skin}
            image={skinImages[index]}
            onUpload={handleSkinUpload}
            onDelete={handleSkinDelete}
          />
        ))}
      </div>

      <SkinPartSelector
        skins={skins}
        selectedParts={selectedParts}
        onPartSelection={handlePartSelection}
      />

      <Button onClick={mergeSkins} className="mb-4">
        Merge Skins
      </Button>

      {/* If merged skin is available, display it with MergedSkinViewer */}
      {mergedSkin && <MergedSkinViewer mergedSkin={mergedSkin} />}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MinecraftSkinMergerPage;
