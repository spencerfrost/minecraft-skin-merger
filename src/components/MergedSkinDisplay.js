import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const MergedSkinDisplay = ({ mergedSkin }) => {
  if (!mergedSkin) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merged Skin</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={mergedSkin} alt="Merged Skin" className="w-full h-auto" />
      </CardContent>
    </Card>
  );
};

export default MergedSkinDisplay;