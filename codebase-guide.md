# Minecraft Skin Merger Codebase Guide

Last updated: 2026-06-26

## Purpose
This document is a high-signal map of the codebase for both human developers and LLM assistants.
Use it to:
- find entry points quickly
- understand request and rendering flow
- know where behavior is defined vs. presented
- avoid common regressions

## Repository Layout
- `client/`: React frontend (Create React App, Tailwind, shadcn/ui components)
- `server/`: Express backend (ESM, Sharp image processing)
- root `package.json`: convenience scripts for running both projects

## High-Level Architecture
Frontend responsibilities:
- collect up to 4 skins (upload or username/UUID fetch)
- allow selecting skin source per body part
- render a 2D composite preview from selected parts
- call backend merge API and render merged output (2D + 3D)

Backend responsibilities:
- accept uploaded PNG files + selected part mapping
- extract predefined texture regions from selected source skins
- composite final 64x64 skin using Sharp
- save result under public directory and return URL
- provide download endpoint and username/UUID fetch proxy endpoint

## Main Entry Points
### Frontend
- `client/src/index.js`: React root bootstrap
- `client/src/App.js`: app-level wrapper
- `client/src/pages/MinecraftSkinMerger/index.jsx`: main page orchestration

### Backend
- `server/src/server.js`: Express app setup, middleware, static serving, health, cleanup scheduler
- `server/src/routes/routes.js`: API routes and download route
- `server/src/controllers/mergeSkins.js`: merge logic (core backend behavior)

## Core Modules You Should Know First
### Frontend state and behavior
- `client/src/hooks/useSkinManagement.js`
  - owns `skins` and `selectedParts`
  - handles upload/delete/part-selection state transitions
- `client/src/hooks/useSkinMerger.js`
  - builds `FormData`
  - posts to `/api/merge-skins`
  - handles merged URL and error state

### Frontend rendering and interaction
- `client/src/components/SkinUploader.js`
  - file upload and username/UUID search fetch flow
- `client/src/components/PartSelector.js`
  - clickable part selection canvas and hit testing
- `client/src/components/SkinPreview.js`
  - 2D composite preview renderer from selected parts
- `client/src/components/MergedSkinViewer.js`
  - merged skin preload, download action, 2D + 3D viewer composition
- `client/src/components/SkinViewer3D.js`
  - skinview3d setup and lifecycle

### Shared client constants
- `client/src/constants/skinParts.js`
  - `skinParts`: canonical list of selectable part names
  - `skinCoords`: selector hit zones and UI coordinates
  - `skinRegions`: preview draw source/destination map

### Backend controllers/config
- `server/src/controllers/mergeSkins.js`
  - parses `selectedParts`
  - maps uploaded files to original indices via filename digits
  - extracts part regions and composites output
  - writes `public/merged-skins/merged-skin-<timestamp>.png`
- `server/src/controllers/fetchSkin.js`
  - validates username/UUID-like input
  - fetches external skin image and relays with restrictive headers
- `server/src/controllers/fileUpload.js`
  - periodic cleanup of uploads and merged outputs
- `server/src/config/config.js`
  - environment-sensitive domain, port, public dir, and CORS options

## End-to-End Runtime Flow
1. User uploads skins or fetches by name/UUID from each uploader card.
2. `useSkinManagement` stores base64 data URLs in `skins[index]`.
3. User clicks parts on `PartSelector` canvases, updating `selectedParts[part] = skinIndex`.
4. `SkinPreview` redraws a 2D preview from selected regions.
5. User clicks Merge.
6. `useSkinMerger` converts base64 URLs to PNG blobs and posts:
   - multipart `skins` files
   - JSON string field `selectedParts`
7. Backend `mergeSkins` extracts configured part rectangles from source files and composites a 64x64 PNG.
8. Server responds with `mergedSkinUrl`.
9. Frontend loads result in `MergedSkinViewer`, displays 2D + 3D previews, and enables download.

## API Contract (Current)
### POST `/api/merge-skins`
Request:
- multipart form-data
- field `skins`: up to 4 files
- field `selectedParts`: JSON object (part name -> skin index)

Response success:
- `{ "mergedSkinUrl": "/public/merged-skins/<filename>.png" }`

Common failures:
- 400 invalid `selectedParts`
- 400 no uploaded skins
- 500 merge failure

### GET `/api/fetch-skin/:name`
- proxies external skin service
- validates `name` with strict regex and max length
- returns image bytes or 500 on failure

### GET `/download/:filename`
- sends merged file download

### GET `/api/health`
- health/status timestamp JSON

## Invariants and Assumptions
- Part names must remain consistent across:
  - client `skinParts`, `skinCoords`, `skinRegions`
  - server merge `regions` keys
- Merge assumes uploaded file names preserve source index digits (for selected part mapping).
- Merged output uses 64x64 canvas and transparent background.
- Frontend stores skins as data URLs before upload.

## Known Risks and Gotchas
1. Port mismatch risk in development
- Client networking now centralizes server origin in `client/src/lib/utils.js` via `getServerOrigin()`.
- Default client dev origin is `http://localhost:3002`, with support for `REACT_APP_SERVER_ORIGIN` and `REACT_APP_API_URL` overrides.
- Server config default dev port is `3002`.

2. Production static client path risk
- Route file uses `../client/build` relative to `server/src/routes`.
- Validate that deployment build copies frontend artifacts to expected location.

3. Error UX dependency on fetch/read failure paths
- `SkinUploader` now surfaces user-facing error strings for search/upload/read failures.
- Future refactors should preserve explicit `setError(...)` behavior rather than only logging.

## Testing Map
Current tests live under `client/src/__tests__/`:
- `MinecraftSkinMerger.test.js`: main page rendering and merge error path
- `PartSelector.test.js`: click interaction basics
- `SkinPreview.test.js`: canvas existence/style/basic draw setup
- `MergedSkinViewer.test.js`: URL mapping and composition wrappers
- `SkinTexture2D.test.js`: texture load/failure states
- `SkinViewer3D.test.js`: component structure and lifecycle basics

Notes:
- Tests are frontend-focused; backend controller behavior has no dedicated test suite in this repo.
- Some canvas/image tests are shallow and rely on mocks.

## Recommended Reading Order Before Changes
1. `README.md`
2. `client/src/pages/MinecraftSkinMerger/index.jsx`
3. `client/src/hooks/useSkinManagement.js`
4. `client/src/hooks/useSkinMerger.js`
5. `client/src/constants/skinParts.js`
6. `client/src/components/PartSelector.js`
7. `client/src/components/SkinPreview.js`
8. `server/src/routes/routes.js`
9. `server/src/controllers/mergeSkins.js`
10. `server/src/config/config.js`

## Change Playbooks
### If changing merge behavior
- Update backend region extraction/composition in `mergeSkins.js`.
- Keep part names in sync with client constants.
- Validate with manual merge flow and preview rendering.

### If changing selectable parts
- Update `skinParts`, `skinCoords`, and `skinRegions` together.
- Update backend `regions` map to match exact keys.
- Re-run relevant tests and manual click-selection checks.

### If changing networking or environments
- Keep API/server origin logic centralized in `client/src/lib/utils.js`.
- Verify dev and production URL behavior in:
  - search/fetch (`SkinUploader`)
  - merge call (`useSkinMerger`)
  - merged image load/download (`MergedSkinViewer`)

### If changing uploads/file formats
- Re-check file type assumptions in frontend base64 conversion and backend Sharp pipeline.
- Ensure cleanup continues to remove temp files safely.

## Suggested Onboarding Checklist
- Install all dependencies from root (`npm run install-all`).
- Run both apps (`npm run dev`) and verify:
  - upload local skin
  - search remote skin
  - select parts and merge
  - download output
- Confirm which dev port is actually active for backend.
- Note: root scripts support `npm run build` and `npm run start`.
- Run frontend tests (`npm test --prefix client`).

## For LLM Assistants
When assisting in this repository:
- prioritize consistency of part names and coordinate maps
- avoid changing both UI and merge contract in one step unless requested
- call out port/build mismatches early when debugging network or startup issues
- when editing merge logic, preserve file cleanup behavior
- update this guide when architecture or contracts change
