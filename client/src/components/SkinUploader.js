import { Upload } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

import PartSelector from "./PartSelector";

import { ReactComponent as Search } from "../assets/search.svg";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const SkinUploader = ({
  index,
  skin,
  onUpload,
  onDelete,
  selectedParts,
  onPartSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSkinUpload = (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        readFile(file, index, onUpload);
      }
    } catch (error) {
      console.error("Error in handleSkinUpload:", error);
    }
  };
  
  const handleSearch = async (event) => {
    try {
      event.preventDefault();
      if (!searchTerm.trim()) return;
  
      const domain =
        process.env.NODE_ENV === "development" ? "http://localhost:3002" : "";
      const url = `${domain}/api/fetch-skin/${encodeURIComponent(searchTerm)}`;
  
      const response = await fetch(url);
      const blob = await response.blob();
      const skinUrl = URL.createObjectURL(blob);
  
      try {
        const base64 = await convertBlobUrlToBase64(skinUrl);
        onUpload(index, base64);
        URL.revokeObjectURL(skinUrl);
      } catch (error) {
        console.error("Failed to convert blob to base64:", error);
        alert("Error converting blob to base64");
      }
    } catch (error) {
      console.error("Failed to fetch skin:", error);
      alert("Error searching for skin");
    }
  };
  
  const readFile = (file, index, onUpload) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        onUpload(index, e.target.result);
      } catch (error) {
        console.error("Error in onUpload callback:", error);
      }
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    try {
      onDelete(index);
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    try {
      setSearchTerm(event.target.value);
    } catch (error) {
      console.error("Error in handleSearchInputChange:", error);
    }
  };

  function convertBlobUrlToBase64(blobUrl) {
    return fetch(blobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Skin {index + 1}
        </CardTitle>
        {skin && (
          <Button
            onClick={handleDelete}
            aria-label="Delete skin"
            size="icon"
          >
            X
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-2">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search by name or UUID..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <Button
              type="submit"
              size="icon-lg"
              aria-label="Search skin"
              className="ml-2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
        {skin ? (
          <div className="flex items-center justify-center">
            <PartSelector
              skinUrl={skin}
              skinIndex={index}
              selectedParts={selectedParts}
              onPartSelection={onPartSelection}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 minecraft-card-content">
            <label className="cursor-pointer flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleSkinUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-text-white mb-2" />
              <span className="font-minecraft text-text-white text-shadow-minecraft">Upload Skin</span>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

SkinUploader.propTypes = {
  index: PropTypes.number.isRequired,
  skin: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedParts: PropTypes.object.isRequired,
  onPartSelection: PropTypes.func.isRequired,
};

export default SkinUploader;