import { useCallback, useMemo } from "react";
import titleImage from "../assets/optimized/title.png";
import MergedSkinViewer from "../components/MergedSkinViewer";
import SkinPreview from "../components/SkinPreview";
import SkinUploader from "../components/SkinUploader";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { useSkinManagement } from "../hooks/useSkinManagement";
import { useSkinMerger } from "../hooks/useSkinMerger";

const MinecraftSkinMergerPage = () => {
  const { skins, selectedParts, handleSkinUpload, handleSkinDelete, handlePartSelection } = useSkinManagement();
  const { mergedSkin, error, mergeSkins } = useSkinMerger();

  const handleMergeSkins = useCallback(() => {
    mergeSkins(skins, selectedParts);
  }, [mergeSkins, skins, selectedParts]);

  const skinUploaders = useMemo(() => (
    skins.map((skin, index) => (
      <SkinUploader
        key={`skinUploader-${index}`}
        index={index}
        skin={skin}
        onUpload={handleSkinUpload}
        onDelete={handleSkinDelete}
        selectedParts={selectedParts}
        onPartSelection={handlePartSelection}
      />
    ))
  ), [skins, selectedParts, handleSkinUpload, handleSkinDelete, handlePartSelection]);

  return (
    <div
      className="min-h-screen bg-minecraft bg-cover bg-center p-2 sm:p-4"
      data-testid="minecraft-skin-merger"
    >
      <div className="md:container mx-auto">
        <header className="mb-4 sm:mb-8">
          <img src={titleImage} alt="Minecraft Skin Merger" className="mx-auto max-w-full" />
          <p className="text-center mt-2 sm:mt-4 flex justify-center px-2 sm:px-4">
            <span className="font-minecraft text-text-white relative px-2 py-1 text-xs sm:text-sm md:text-base">
              <span className="relative z-10">
                Add up to 4 skins, select the body parts, and then merge them together to create a new skin.
              </span>
              <span
                className="absolute inset-0 bg-black opacity-50"
                aria-hidden="true"
              />
            </span>
          </p>
        </header>

        <main>
          <section aria-label="Skin Upload and Preview Area">
            <h2 className="sr-only">Skin Uploaders and Preview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-4">
                  {skinUploaders.slice(0, 2)}
                </div>
              </div>

              <div className="lg:col-span-1 order-1 lg:order-2">
                <SkinPreview
                  skins={skins}
                  selectedParts={selectedParts}
                  className="h-full"
                  data-testid="skin-preview"
                />
              </div>

              <div className="lg:col-span-1 order-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-4">
                  {skinUploaders.slice(2, 4)}
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Merge Controls" className="mt-4 sm:mt-6">
            <h2 className="sr-only">Merge Skins</h2>
            <div className="flex justify-center">
              <Button onClick={handleMergeSkins} data-testid="merge-skins-button">
                Merge Skins
              </Button>
            </div>
          </section>

          {error && (
            <section aria-label="Error Messages" className="mt-2 sm:mt-4">
              <h2 className="sr-only">Error Information</h2>
              <Alert
                variant="destructive"
                data-testid="error-alert"
              >
                <AlertTitle className="font-minecraft">Error</AlertTitle>
                <AlertDescription className="font-minecraft">
                  {error}
                </AlertDescription>
              </Alert>
            </section>
          )}

          {mergedSkin && (
            <section aria-label="Merged Skin Result" className="mt-4 sm:mt-8">
              <h2 className="sr-only">Merged Skin Viewer</h2>
              <MergedSkinViewer
                mergedSkin={mergedSkin}
                data-testid="merged-skin-viewer"
              />
            </section>
          )}
        </main>

        <footer className="mt-4 sm:mt-8 text-center">
          <p className="font-minecraft text-text-white text-xs sm:text-sm">&copy; 2024 Minecraft Skin Merger. Created by Spencer Frost.</p>
        </footer>
      </div>
    </div>
  );
};

export default MinecraftSkinMergerPage;