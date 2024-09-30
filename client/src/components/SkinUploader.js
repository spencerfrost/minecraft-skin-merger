import { Search, Upload, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import MinecraftSkinRenderer from "./PartSelector";
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
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(index, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    const domain =
      process.env.NODE_ENV === "development" ? "http://localhost:3002" : "";
    const url = `${domain}/api/fetch-skin/${encodeURIComponent(searchTerm)}`;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const skinUrl = URL.createObjectURL(blob);

      convertBlobUrlToBase64(skinUrl)
        .then((base64) => {
          onUpload(index, base64);
          URL.revokeObjectURL(skinUrl);
        })
        .catch((error) => {
          console.error("Failed to convert blob to base64:", error);
          alert("Error converting blob to base64");
        });
    } catch (error) {
      console.error("Failed to fetch skin:", error);
      alert("Error searching for skin");
    }
  };

  const handleDelete = () => {
    onDelete(index);
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
          <button
            onClick={handleDelete}
            className="minecraft-btn"
            aria-label="Delete skin"
          >
            <span className="title">
              <X className="w-4 h-4" />
            </span>
          </button>
        )}
      </CardHeader>
      <CardContent className="p-2">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search by name or UUID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="minecraft-btn p-2"
              aria-label="Search skin"
            >
              <span className="title">
                <Search className="w-4 h-4" />
              </span>
            </button>
          </div>
        </form>
        {skin ? (
          <div className="minecraft-card-content">
            <MinecraftSkinRenderer
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
