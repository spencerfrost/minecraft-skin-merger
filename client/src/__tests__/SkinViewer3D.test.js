import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import * as skinview3d from 'skinview3d';
import SkinViewer3D from '../components/SkinViewer3D';

// Mock skinview3d
jest.mock('skinview3d', () => ({
  SkinViewer: jest.fn(),
  WalkingAnimation: jest.fn()
}));

describe('SkinViewer3D', () => {
  const mockSkinUrl = 'http://example.com/skin.png';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock the SkinViewer constructor and its methods
    skinview3d.SkinViewer.mockImplementation(() => ({
      camera: { position: { set: jest.fn() }, lookAt: jest.fn() },
      animation: null,
      autoRotate: false,
      zoom: 1,
      globalLight: { intensity: 1 },
      cameraLight: { intensity: 1 },
      background: null,
      dispose: jest.fn()
    }));
  });

  test('renders a canvas element', () => {
    const { container } = render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    const canvasElement = container.querySelector('canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  test('initializes SkinViewer with correct props', () => {
    render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    expect(skinview3d.SkinViewer).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 600,
        height: 800,
        skin: mockSkinUrl
      })
    );
  });

  test('sets up animation', () => {
    render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    expect(skinview3d.WalkingAnimation).toHaveBeenCalled();
  });

  test('configures camera and lighting', () => {
    render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    const skinViewerInstance = skinview3d.SkinViewer.mock.results[0].value;

    expect(skinViewerInstance.camera.position.set).toHaveBeenCalledWith(30, 0, 0);
    expect(skinViewerInstance.camera.lookAt).toHaveBeenCalledWith(0, 0, 0);
    expect(skinViewerInstance.autoRotate).toBe(false);
    expect(skinViewerInstance.zoom).toBe(0.9);
    expect(skinViewerInstance.globalLight.intensity).toBe(2);
    expect(skinViewerInstance.cameraLight.intensity).toBe(1.8);
    expect(skinViewerInstance.background).toBe(0xeeeeee);
  });

  test('disposes SkinViewer on unmount', () => {
    const { unmount } = render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    const skinViewerInstance = skinview3d.SkinViewer.mock.results[0].value;
    
    unmount();
    
    expect(skinViewerInstance.dispose).toHaveBeenCalled();
  });

  test('reinitializes SkinViewer when skinUrl changes', () => {
    const { rerender } = render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    expect(skinview3d.SkinViewer).toHaveBeenCalledTimes(1);

    const newSkinUrl = 'http://example.com/new-skin.png';
    rerender(<SkinViewer3D skinUrl={newSkinUrl} />);

    expect(skinview3d.SkinViewer).toHaveBeenCalledTimes(2);
    expect(skinview3d.SkinViewer).toHaveBeenLastCalledWith(
      expect.objectContaining({ skin: newSkinUrl })
    );
  });
});