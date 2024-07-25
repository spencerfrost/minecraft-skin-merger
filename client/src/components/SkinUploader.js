import { Upload } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const SkinUploader = ({ index, skin, onUpload }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

    const endpoint = `/v1/skin/${encodeURIComponent(searchTerm)}`; // or /v1/body/:name for the body
    const url = `https://skins.danielraybone.com${endpoint}`;

    try {
      const response = await fetch(url);
      const blob = await response.blob(); // Assuming the response is an image
      const imageUrl = URL.createObjectURL(blob);

      onUpload(index, imageUrl);
    } catch (error) {
      console.error('Failed to fetch skin:', error);
      alert('Error searching for skin');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skin {index + 1}</CardTitle>
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
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </form>
        {skin ? (
          <img src={skin} alt={`Skin ${index + 1}`} className="w-full h-auto" />
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
