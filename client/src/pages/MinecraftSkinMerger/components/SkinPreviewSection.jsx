import React from 'react';
import SkinPreview from "../../../components/SkinPreview";

const SkinPreviewSection = ({ skins, selectedParts }) => (
  <div className="lg:col-span-1 order-1 lg:order-2">
    <SkinPreview
      skins={skins}
      selectedParts={selectedParts}
      className="h-full"
      data-testid="skin-preview"
    />
  </div>
);

export default React.memo(SkinPreviewSection);