import { useEffect, useState } from "react";
import titleImage from "../assets/optimized/title.png";
import MergedSkinViewer from "../components/MergedSkinViewer";
import SkinPreview from "../components/SkinPreview";
import SkinUploader from "../components/SkinUploader";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { skinParts } from "../constants/skinParts";

const API_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3002/api";

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
          const base64Data = skin.split(",")[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/png" });
          formData.append("skins", blob, `skin${index}.png`);
        } catch (error) {
          console.error(`Error processing skin at index ${index}:`, error);
        }
      }
    });

    formData.append("selectedParts", JSON.stringify(selectedParts));

    try {
      const response = await fetch(`${API_URL}/merge-skins`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.mergedSkinUrl) {
        setMergedSkin(data.mergedSkinUrl);
        console.log("Merged skin set:", data.mergedSkinUrl);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError(`Error merging skins: ${error.message}`);
      console.error("Error during skin merge:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-minecraft-bg bg-cover bg-center p-4"
      data-testid="minecraft-skin-merger"
    >
      <div className="container mx-auto max-w-6xl">
        <header>
          <img src={titleImage} alt="Minecraft Skin Merger" className="mx-auto" />
          <p className="text-center mb-8 flex justify-center">
            <span className="font-minecraft text-text-white relative px-2 py-1">
              <span className="relative z-10">
                Upload up to 4 skins, select the body parts, and then merge them
                together to create a new skin.
              </span>
              <span
                className="absolute inset-0 bg-black opacity-50"
                aria-hidden="true"
              />
            </span>
          </p>
        </header>

        <main>
          <section aria-label="Skin Upload and Preview Area">
            <h2 className="sr-only">Skin Uploaders and Preview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-4">
                  {skins.slice(0, 2).map((skin, index) => (
                    <SkinUploader
                      key={`skinUploader-${index}`}
                      index={index}
                      skin={skin}
                      onUpload={handleSkinUpload}
                      onDelete={handleSkinDelete}
                      selectedParts={selectedParts}
                      onPartSelection={handlePartSelection}
                      data-testid={`skin-uploader-${index}`}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-1">
                <SkinPreview
                  skins={skins}
                  selectedParts={selectedParts}
                  className="h-full"
                  data-testid="skin-preview"
                />
              </div>

              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-4">
                  {skins.slice(2, 4).map((skin, index) => (
                    <SkinUploader
                      key={`skinUploader-${index + 2}`}
                      index={index + 2}
                      skin={skin}
                      onUpload={handleSkinUpload}
                      onDelete={handleSkinDelete}
                      selectedParts={selectedParts}
                      onPartSelection={handlePartSelection}
                      data-testid={`skin-uploader-${index + 2}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Merge Controls">
            <h2 className="sr-only">Merge Skins</h2>
            <div className="mt-4 flex justify-center">
              <Button onClick={mergeSkins} data-testid="merge-skins-button">
                Merge Skins
              </Button>
            </div>
          </section>

          {mergedSkin && (
            <section aria-label="Merged Skin Result" className="mt-8">
              <h2 className="sr-only">Merged Skin Viewer</h2>
              <MergedSkinViewer
                mergedSkin={mergedSkin}
                data-testid="merged-skin-viewer"
              />
            </section>
          )}

          {error && (
            <section aria-label="Error Messages" className="mt-8">
              <h2 className="sr-only">Error Information</h2>
              <Alert
                variant="destructive"
                data-testid="error-alert"
              >
                <AlertTitle className="font-minecraft">Error</AlertTitle>
                <AlertDescription className="font-minecraft">
                  {error}
                </AlertDescription>
              </Alert>
            </section>
          )}
        </main>

        <footer className="mt-8 text-center">
          <p className="font-minecraft text-text-white">&copy; 2024 Minecraft Skin Merger. Created by Spencer Frost.</p>
        </footer>
      </div>
    </div>
  );
};

export default MinecraftSkinMergerPage;
