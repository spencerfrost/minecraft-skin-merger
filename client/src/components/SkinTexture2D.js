
const SkinTexture2D = ({ skinUrl }) => {
  return (
    <div className="border border-gray-300 p-2 bg-white">
      <img src={skinUrl} alt="Skin Texture" className="w-full h-auto" />
    </div>
  );
};

export default SkinTexture2D;