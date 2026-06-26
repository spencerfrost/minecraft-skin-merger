import { render, screen } from '@testing-library/react';
import MergedSkinViewer from '../components/MergedSkinViewer';

// Mock the child components
jest.mock('../components/SkinTexture2D', () => {
  return function MockedSkinTexture2D(props) {
    return <div data-testid="mocked-2d-viewer" {...props} />;
  };
});

jest.mock('../components/SkinViewer3D', () => {
  return function MockedSkinViewer3D(props) {
    return <div data-testid="mocked-3d-viewer" {...props} />;
  };
});

jest.mock('../components/ui/button', () => ({
  Button: function MockedButton(props) {
    return <button data-testid="mocked-button" {...props} />;
  },
}));

describe('MergedSkinViewer', () => {
  const mockMergedSkin = '/public/merged-skin-123456789.png';
  let originalImage;

  beforeAll(() => {
    // 1. Mock the Image prototype so that setting .src fires .onload immediately
    originalImage = global.Image;
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
      set src(url) {
        this._src = url;
      }
      get src() {
        return this._src;
      }
    };
  });

  afterAll(() => {
    // Restore original Image constructor
    global.Image = originalImage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders SkinTexture2D and SkinViewer3D components', async () => {
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);

    // 2. Use findByTestId to wait for the macro-task/setTimeout to resolve the state change
    expect(await screen.findByTestId('mocked-2d-viewer')).toBeInTheDocument();
    expect(await screen.findByTestId('mocked-3d-viewer')).toBeInTheDocument();
    expect(await screen.findByTestId('mocked-button')).toBeInTheDocument();
  });

  it('passes correct skin URL to components', async () => {
    process.env.NODE_ENV = 'development';
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);

    const expectedUrl = `http://localhost:3002${mockMergedSkin}`;
    const viewer2D = await screen.findByTestId('mocked-2d-viewer');
    const viewer3D = await screen.findByTestId('mocked-3d-viewer');

    expect(viewer2D).toHaveAttribute('skinUrl', expectedUrl);
    expect(viewer3D).toHaveAttribute('skinUrl', expectedUrl);
  });

  it('uses correct skin URL for production environment', async () => {
    process.env.NODE_ENV = 'production';
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);

    const viewer3D = await screen.findByTestId('mocked-3d-viewer');
    expect(viewer3D).toHaveAttribute('skinUrl', mockMergedSkin);
  });
});
