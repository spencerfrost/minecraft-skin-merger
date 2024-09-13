import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MinecraftSkinMerger from '../pages/MinecraftSkinMerger';

// Mock child components
jest.mock('../components/SkinUploader', () => ({ index }) => (
  <div data-testid={`skin-uploader-${index}`}>Mocked SkinUploader</div>
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
    json: () => Promise.resolve({ mergedSkinUrl: 'mock-merged-skin-url' }),
  })
);

describe('MinecraftSkinMerger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    render(<MinecraftSkinMerger />);
    
    expect(screen.getByTestId('minecraft-skin-merger')).toBeInTheDocument();
    expect(screen.getByTestId('merger-title')).toHaveTextContent('Minecraft Skin Merger');
    expect(screen.getByTestId('merger-subtitle')).toHaveTextContent('By Spencer Frost');
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

  test('renders merge button', () => {
    render(<MinecraftSkinMerger />);
    
    const mergeButton = screen.getByTestId('merge-skins-button');
    expect(mergeButton).toBeInTheDocument();
    expect(mergeButton).toHaveTextContent('Merge Skins');
  });

  test('does not render MergedSkinViewer initially', () => {
    render(<MinecraftSkinMerger />);
    
    expect(screen.queryByTestId('merged-skin-viewer')).not.toBeInTheDocument();
  });
});