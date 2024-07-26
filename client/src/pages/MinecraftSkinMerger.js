import { useEffect, useState } from "react";
import MergedSkinViewer from "../components/MergedSkinViewer";
import SkinPreview from "../components/SkinPreview";
import SkinUploader from "../components/SkinUploader";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";

const API_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3002/api";

  const skinParts = [
    "Head", "Hat", "Body", "Jacket", "Left Arm", "Left Sleeve", "Right Arm", "Right Sleeve",
    "Left Leg", "Left Pant", "Right Leg", "Right Pant"
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

  const handleSkinDelete = (index) => {
    const newSkins = [...skins];
    newSkins[index] = null;
    setSkins(newSkins);

    // If this is the last skin deleted, clear all selected parts
    if (newSkins.every((skin) => skin === null)) {
      setSelectedParts({});
    } else {
      // Update selectedParts to remove references to the deleted skin
      const updatedSelectedParts = { ...selectedParts };
      Object.keys(updatedSelectedParts).forEach((part) => {
        if (updatedSelectedParts[part] === index) {
          updatedSelectedParts[part] = null;
        }
      });
      setSelectedParts(updatedSelectedParts);
    }
  };

  const handlePartSelection = (part, skinIndex) => {
    setSelectedParts((prevParts) => ({
      ...prevParts,
      [part]: skinIndex,
    }));
  };

  useEffect(() => {
    // If there's at least one skin uploaded and no parts are selected yet
    // Set all parts to use the first skin uploaded
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
  }, [skins]); // eslint-disable-line react-hooks/exhaustive-deps

  const mergeSkins = async () => {
    setError(null);
    const formData = new FormData();
  
    skins.forEach((skin, index) => {
      if (skin) {
        try {
          const base64Data = skin.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
          formData.append('skins', blob, `skin${index}.png`);
        } catch (error) {
          console.error(`Error processing skin at index ${index}:`, error);
        }
      }
    });
  
    formData.append('selectedParts', JSON.stringify(selectedParts));
  
    try {
      const response = await fetch(`${API_URL}/merge-skins`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.mergedSkinUrl) {
        setMergedSkin(data.mergedSkinUrl);
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      setError(`Error merging skins: ${error.message}`);
      console.error('Error during skin merge:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Minecraft Skin Merger</h1>
      {/* By Spencer Frost */}
      <h5 className="text-xl font-bold mb-2 text-center">By Spencer Frost</h5>
      <p className="text-center mb-8">
        Upload up to 4 skins, select the body parts, and then merge them together to create a new skin.
      </p>


      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="lg:w-1/4">
          <div className="grid grid-cols-1 gap-4">
            {skins.slice(0, 2).map((skin, index) => (
              <SkinUploader
                key={`skinUploader-${skin ? skin.name : index}`}
                index={index}
                skin={skin}
                onUpload={handleSkinUpload}
                onDelete={handleSkinDelete}
                selectedParts={selectedParts}
                onPartSelection={handlePartSelection}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="flex justify-center items-center h-full">
            <SkinPreview skins={skins} selectedParts={selectedParts} />
          </div>
        </div>

        <div className="lg:w-1/4">
          <div className="grid grid-cols-1 gap-4">
            {skins.slice(2, 4).map((skin, index) => (
              <SkinUploader
                key={`skinUploader-${skin ? skin.name : index + 2}`}
                index={index + 2}
                skin={skin}
                onUpload={handleSkinUpload}
                onDelete={handleSkinDelete}
                selectedParts={selectedParts}
                onPartSelection={handlePartSelection}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={mergeSkins} className="mb-4">
          Merge Skins
        </Button>

        {mergedSkin && <MergedSkinViewer mergedSkin={mergedSkin} />}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MinecraftSkinMergerPage;
