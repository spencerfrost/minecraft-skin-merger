import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const SkinUploader = ({ index, skin, onUpload }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skin {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
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