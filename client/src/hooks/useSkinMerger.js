import { useState } from 'react';

const API_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3002/api";

export const useSkinMerger = () => {
  const [mergedSkin, setMergedSkin] = useState(null);
  const [error, setError] = useState(null);

  const mergeSkins = async (skins, selectedParts) => {
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
          setError(`Error processing skin at index ${index}: ${error.message}`);
          return;
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
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError(`Error merging skins: ${error.message}`);
    }
  };

  return { mergedSkin, error, mergeSkins };
};