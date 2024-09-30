// SkinViewer3D.test.js
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import * as skinview3d from 'skinview3d';
import SkinViewer3D from '../components/SkinViewer3D';

jest.mock('skinview3d', () => ({
  SkinViewer: jest.fn(),
  WalkingAnimation: jest.fn()
}));

describe('SkinViewer3D', () => {
  const mockSkinUrl = 'http://example.com/skin.png';
  let mockDispose;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispose = jest.fn();
    skinview3d.SkinViewer.mockImplementation(() => ({
      camera: { position: { set: jest.fn() }, lookAt: jest.fn() },
      animation: null,
      autoRotate: false,
      zoom: 1,
      globalLight: { intensity: 1 },
      cameraLight: { intensity: 1 },
      background: null,
      dispose: mockDispose
    }));
  });

  test('renders a Card component with correct structure', () => {
    const { getByText, container } = render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    expect(getByText('Interactive 3D Preview')).toBeInTheDocument();
    expect(container.querySelector('.bg-black')).toBeInTheDocument();
  });

  test('initializes SkinViewer with correct props', () => {
    render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    expect(skinview3d.SkinViewer).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 500,
        height: 500,
        skin: mockSkinUrl
      })
    );
  });

  test('sets up animation with correct speed', () => {
    render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    const skinViewerInstance = skinview3d.SkinViewer.mock.results[0].value;
    expect(skinview3d.WalkingAnimation).toHaveBeenCalled();
    expect(skinViewerInstance.animation.speed).toBe(0.6);
  });

  test('configures camera and lighting', () => {
    render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    const skinViewerInstance = skinview3d.SkinViewer.mock.results[0].value;

    expect(skinViewerInstance.camera.position.set).toHaveBeenCalledWith(0, 0, 60);
    expect(skinViewerInstance.camera.lookAt).toHaveBeenCalledWith(0, 0, 0);
    expect(skinViewerInstance.autoRotate).toBe(false);
    expect(skinViewerInstance.zoom).toBe(0.9);
    expect(skinViewerInstance.globalLight.intensity).toBe(2.8);
    expect(skinViewerInstance.cameraLight.intensity).toBe(2);
    expect(skinViewerInstance.background).toBe("#000000");
  });

  test('disposes SkinViewer on unmount', () => {
    const { unmount } = render(<SkinViewer3D skinUrl={mockSkinUrl} />);
    
    act(() => {
      unmount();
    });
    
    expect(mockDispose).toHaveBeenCalled();
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
    expect(mockDispose).toHaveBeenCalledTimes(1);
  });
});