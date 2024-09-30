// import { useEffect, useRef } from "react";
// import * as skinview3d from "skinview3d";
// import { skinCoords, skinParts, skinRegions } from "../constants/skinParts";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";

// const SkinPreview3D = ({ skins, selectedParts }) => {
//   const canvas3DRef = useRef(null);
//   const canvas2DRef = useRef(null);
//   const skinViewerRef = useRef(null);

//   useEffect(() => {
//     if (canvas3DRef.current && !skinViewerRef.current) {
//       try {
//         skinViewerRef.current = new skinview3d.SkinViewer({
//           canvas: canvas3DRef.current,
//           width: 300,
//           height: 400,
//           skin: createEmptySkin(),
//         });

//         skinViewerRef.current.camera.position.set(30, 0, 0);
//         skinViewerRef.current.camera.lookAt(0, 0, 0);
//         skinViewerRef.current.autoRotate = true;
//         skinViewerRef.current.animation = new skinview3d.WalkingAnimation();

//         console.log("SkinViewer initialized");
//       } catch (error) {
//         console.log(`Error initializing SkinViewer: ${error.message}`);
//       }
//     }

//     return () => {
//       if (skinViewerRef.current) {
//         skinViewerRef.current.dispose();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (skinViewerRef.current && skins.some((skin) => skin !== null)) {
//       updateMergedSkin();
//     }
//   }, [skins, selectedParts]);

//   const createEmptySkin = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = 64;
//     canvas.height = 64;
//     const ctx = canvas.getContext("2d");
//     ctx.fillStyle = "rgba(0, 0, 0, 0)";
//     ctx.fillRect(0, 0, 64, 64);
//     return canvas;
//   };

//   const updateMergedSkin = async () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = 64;
//     canvas.height = 64;
//     const ctx = canvas.getContext("2d");

//     console.log("Updating merged skin");

//     for (const part of skinParts) {
//       const skinIndex = selectedParts[part];
//       if (skinIndex !== undefined && skins[skinIndex]) {
//         try {
//           await new Promise((resolve, reject) => {
//             const img = new Image();
//             img.crossOrigin = "Anonymous";
//             img.onload = () => {
//               const { x, y, w, h } = skinRegions[part];
//               const { x: dx, y: dy, w: dw, h: dh } = skinCoords[part];
//               ctx.drawImage(img, x, y, w, h, dx, dy, dw, dh);
//               console.log(`Drew ${part} from skin ${skinIndex}`);
//               resolve();
//             };
//             img.onerror = () =>
//               reject(
//                 new Error(
//                   `Failed to load image for ${part} from skin ${skinIndex}`
//                 )
//               );
//             img.src = skins[skinIndex];
//           });
//         } catch (error) {
//           console.log(error.message);
//         }
//       } else {
//         console.log(`Skipped ${part}, no skin selected`);
//       }
//     }

//     const newSkinUrl = canvas.toDataURL();

//     if (skinViewerRef.current) {
//       try {
//         await skinViewerRef.current.loadSkin(newSkinUrl);
//       } catch (error) {
//         console.log(`Error loading skin into 3D viewer: ${error.message}`);
//       }
//     } else {
//       console.log("Error: 3D SkinViewer not initialized");
//     }

//     // Update 2D preview
//     if (canvas2DRef.current) {
//       const ctx2D = canvas2DRef.current.getContext("2d");
//       ctx2D.clearRect(0, 0, 64, 64);
//       ctx2D.drawImage(canvas, 0, 0);
//       console.log("2D preview updated");
//     } else {
//       console.log("Error: 2D canvas not available");
//     }
//   };

//   const testWithKnownSkin = async () => {
//     const knownSkinUrl = "../../../server/public/merged-skin-1725038124720.png";
//     console.log(`Testing with known skin: ${knownSkinUrl}`);
//     try {
//       await skinViewerRef.current.loadSkin(knownSkinUrl);
//       console.log("Known skin loaded successfully");
//     } catch (error) {
//       console.log(`Error loading known skin: ${error.message}`);
//     }
//   };

//   const checkSkinViewerInstance = () => {
//     if (skinViewerRef.current) {
//       console.log("SkinViewer instance exists");
//       // Test a method to ensure it's responsive
//       skinViewerRef.current.autoRotate = !skinViewerRef.current.autoRotate;
//       console.log(`AutoRotate toggled to: ${skinViewerRef.current.autoRotate}`);
//     } else {
//       console.log("SkinViewer instance does not exist");
//     }
//   };

//   return (
//     <div>
//       <Card className="h-full">
//         <div className="bg-black h-full flex flex-col justify-center items-center relative p-4">
//           <div className="absolute inset-0 border-t-2 border-l-2 border-input-border-top" />
//           <div className="absolute inset-0 border-b-2 border-r-2 border-input-border-bottom" />
//           <div className="skin-preview mb-4">
//             <canvas ref={canvas3DRef} width="300" height="400" />
//           </div>
//           <div className="skin-texture mb-4">
//             <canvas
//               ref={canvas2DRef}
//               width="64"
//               height="64"
//               style={{
//                 imageRendering: "pixelated",
//                 width: "128px",
//                 height: "128px",
//               }}
//             />
//           </div>
//         </div>
//       </Card>
//       <div className="debug-controls mb-4">
//         <Button onClick={testWithKnownSkin} className="mr-2">
//           Test Known Skin
//         </Button>
//         <Button onClick={checkSkinViewerInstance}>
//           Check SkinViewer Instance
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SkinPreview3D;
