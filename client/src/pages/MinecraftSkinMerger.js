import { useEffect, useState } from 'react';
import SkinPartSelector from '../components/SkinPartSelector';
import SkinTexture2D from '../components/SkinTexture2D';
import SkinUploader from '../components/SkinUploader';
import SkinViewer3D from '../components/SkinViewer3D';
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
  const [selectedParts, setSelectedParts] = useState({});
  const [mergedSkin, setMergedSkin] = useState(null);
  const [error, setError] = useState(null);

  const handleSkinUpload = (index, skin) => {
    const newSkins = [...skins];
    newSkins[index] = skin;
    setSkins(newSkins);

    // If this is the first skin uploaded, set all parts to use this skin
    if (index === 0 && !skins[0]) {
      const newSelectedParts = {};
      skinParts.forEach((part) => {
        newSelectedParts[part] = 0;
      });
      setSelectedParts(newSelectedParts);
    }
  };

  // This effect will run when skins change
  useEffect(() => {
    // If there's at least one skin uploaded and no parts are selected yet
    if (
      skins.some((skin) => skin !== null) &&
      Object.keys(selectedParts).length === 0
    ) {
      const firstSkinIndex = skins.findIndex((skin) => skin !== null);
      const newSelectedParts = {};
      skinParts.forEach((part) => {
        newSelectedParts[part] = firstSkinIndex;
      });
      setSelectedParts(newSelectedParts);
    }
  }, [skins, selectedParts]);

  const handlePartSelection = (part, skinIndex) => {
    setSelectedParts({ ...selectedParts, [part]: skinIndex });
  };

  const mergeSkins = async () => {
    setError(null);
    const formData = new FormData();
    skins.forEach((skin, index) => {
      if (skin) {
        const byteString = atob(skin.split(',')[1]);
        const mimeString = skin.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append('skins', blob, `skin${index}.png`);
      }
    });
    formData.append('selectedParts', JSON.stringify(selectedParts));

    try {
      // print the novde env
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('Sending request to:', `${API_URL}/merge-skins`);
      const response = await fetch(`${API_URL}/merge-skins`, {
        method: 'POST',
        body: formData,
      });
      const text = await response.text();
      
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
        console.error('Server responded with:', text);
      }
    } catch (error) {
      setError('Error merging skins');
      console.error('Error merging skins:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minecraft Skin Merger</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {skins.map((skin, index) => (
          <SkinUploader
            key={index}
            index={index}
            skin={skin}
            onUpload={handleSkinUpload}
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

      {mergedSkin && (
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
      )}

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
