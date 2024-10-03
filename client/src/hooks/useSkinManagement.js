import { useCallback, useEffect, useState } from 'react';
import { skinParts } from '../constants/skinParts';

export const useSkinManagement = () => {
  const [skins, setSkins] = useState([null, null, null, null]);
  const [selectedParts, setSelectedParts] = useState({});

  const handleSkinUpload = useCallback((index, skin) => {
    setSkins(prevSkins => {
      const newSkins = [...prevSkins];
      newSkins[index] = skin;
      return newSkins;
    });

    if (index === 0 && !skins[0]) {
      const newSelectedParts = {};
      skinParts.forEach((part) => {
        newSelectedParts[part] = 0;
      });
      setSelectedParts(newSelectedParts);
    }
  }, [skins]);

  const handleSkinDelete = useCallback((index) => {
    setSkins(prevSkins => {
      const newSkins = [...prevSkins];
      newSkins[index] = null;
      return newSkins;
    });

    setSelectedParts(prevParts => {
      if (skins.every((skin, i) => i === index || skin === null)) {
        return {};
      } else {
        const updatedParts = { ...prevParts };
        Object.keys(updatedParts).forEach((part) => {
          if (updatedParts[part] === index) {
            updatedParts[part] = null;
          }
        });
        return updatedParts;
      }
    });
  }, [skins]);

  const handlePartSelection = useCallback((part, skinIndex) => {
    setSelectedParts(prevParts => ({
      ...prevParts,
      [part]: skinIndex,
    }));
  }, []);

  useEffect(() => {
    if (skins.some(skin => skin !== null) && Object.keys(selectedParts).length === 0) {
      const firstSkinIndex = skins.findIndex(skin => skin !== null);
      const newSelectedParts = {};
      skinParts.forEach(part => {
        newSelectedParts[part] = firstSkinIndex;
      });
      setSelectedParts(newSelectedParts);
    }
  }, [skins, selectedParts]);

  return {
    skins,
    selectedParts,
    handleSkinUpload,
    handleSkinDelete,
    handlePartSelection
  };
};