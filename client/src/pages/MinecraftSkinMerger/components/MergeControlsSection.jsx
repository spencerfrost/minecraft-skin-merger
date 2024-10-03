import React from 'react';
import { Button } from "../../../components/ui/button";

const MergeControlsSection = ({ onMerge }) => (
  <section aria-label="Merge Controls" className="mt-4 sm:mt-6">
    <h2 className="sr-only">Merge Skins</h2>
    <div className="flex justify-center">
      <Button onClick={onMerge} data-testid="merge-skins-button">
        Merge Skins
      </Button>
    </div>
  </section>
);

export default React.memo(MergeControlsSection);