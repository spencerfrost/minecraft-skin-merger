import { Search, Upload, X } from "lucide-react";
import { useState } from "react";
import "../styles/SkinUploader.css";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const SkinUploader = ({ index, skin, image, onUpload, onDelete }) => {
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
    event.preventDefault(); // Prevent form submission from reloading the page
    if (!searchTerm.trim()) return; // Optional: prevent search with empty query

    // use server endpoint to fetch skin.
    // if you're running the server locally, you can use the following URL:
    const domain = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "";
    const url = `${domain}/api/fetch-skin/${encodeURIComponent(searchTerm)}`;

    try {
      const response = await fetch(url);
      const blob = await response.blob(); // Assuming the response is an image
      const skinUrl = URL.createObjectURL(blob);
      try {
        const imageUrl = await convertBlobUrlToBase64(skinUrl);
        console.log(imageUrl);
        onUpload(index, imageUrl, skinUrl);
      } catch (error) {
        console.error("Failed to convert blob to base64:", error);
        alert("Error converting blob to base64");
      }
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
        // Check if the MIME type is already image/png
        if (blob.type !== "image/png") {
          // Create a new blob with the correct MIME type if necessary
          blob = new Blob([blob], { type: "image/png" });
        }
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
      <CardHeader className="py-4">
        <CardTitle>
          Skin {index + 1}
          {/* Only show delete button if skin is uploaded */}
          {skin && (
            <button
              disabled={!skin}
              onClick={handleDelete}
              className="float-right py-0 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            placeholder="Search by name or UUID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-2 text-gray-500 hover:text-blue-500"
          >
            <Search />
          </button>
        </form>
        {skin ? (
          <img src={image} alt={`Skin ${index + 1}`} className="w-full h-auto" />
        ) : (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleSkinUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-gray-400" />
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkinUploader;
