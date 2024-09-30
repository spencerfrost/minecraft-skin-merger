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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders SkinTexture2D and SkinViewer3D components', () => {
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);
    
    expect(screen.getByTestId('mocked-2d-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-3d-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-button')).toBeInTheDocument();
  });

  it('passes correct skin URL to components', () => {
    process.env.NODE_ENV = 'development';
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);
    
    const expectedUrl = `http://localhost:3002${mockMergedSkin}`;
    expect(screen.getByTestId('mocked-2d-viewer')).toHaveAttribute('skinUrl', expectedUrl);
    expect(screen.getByTestId('mocked-3d-viewer')).toHaveAttribute('skinUrl', expectedUrl);
  });

  it('uses correct skin URL for production environment', () => {
    process.env.NODE_ENV = 'production';
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);
    
    expect(screen.getByTestId('mocked-3d-viewer')).toHaveAttribute('skinUrl', mockMergedSkin);
  });
});