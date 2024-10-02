// MinecraftSkinMerger.test.js
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MinecraftSkinMerger from '../pages/MinecraftSkinMerger';

// Mock child components
jest.mock('../components/SkinUploader', () => ({ index, onUpload }) => (
  <div data-testid={`skin-uploader-${index}`}>
    <button onClick={() => onUpload(index, `mock-skin-data-${index}`)}>Upload Skin</button>
  </div>
));

jest.mock('../components/SkinPreview', () => () => (
  <div data-testid="skin-preview">Mocked SkinPreview</div>
));

jest.mock('../components/MergedSkinViewer', () => ({ mergedSkin }) => (
  <div data-testid="merged-skin-viewer">{mergedSkin}</div>
));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ mergedSkinUrl: '/mock-merged-skin-url' }),
  })
);

describe('MinecraftSkinMerger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    render(<MinecraftSkinMerger />);
    
    expect(screen.getByTestId('minecraft-skin-merger')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByAltText('Minecraft Skin Merger')).toBeInTheDocument();

    expect(screen.getByText('Upload up to 4 skins, select the body parts, and then merge them together to create a new skin.')).toBeInTheDocument();
  });

  test('renders skin uploaders', () => {
    render(<MinecraftSkinMerger />);
    
    const skinUploaders = screen.getAllByTestId(/skin-uploader-/);
    expect(skinUploaders).toHaveLength(4);
  });

  test('renders skin preview', () => {
    render(<MinecraftSkinMerger />);
    
    expect(screen.getByTestId('skin-preview')).toBeInTheDocument();
  });

  test('displays error message when merge fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Merge failed')));

    render(<MinecraftSkinMerger />);
    
    const mergeButton = screen.getByTestId('merge-skins-button');
    fireEvent.click(mergeButton);

    await waitFor(() => {
      expect(screen.getByText(/Error merging skins/)).toBeInTheDocument();
    });
  });
});