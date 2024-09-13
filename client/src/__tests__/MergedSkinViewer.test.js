import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MergedSkinViewer from '../components/MergedSkinViewer';

// Mock the child components
jest.mock('../components/SkinTexture2D', () => () => null);
jest.mock('../components/SkinViewer3D', () => () => null);

describe('MergedSkinViewer', () => {
  const mockMergedSkin = '/public/merged-skin-123456789.png';
  const mockDomain = 'http://localhost:3002';

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  test('renders section headings', () => {
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);

    expect(screen.getByText('2D Texture')).toBeInTheDocument();
    expect(screen.getByText('3D Preview')).toBeInTheDocument();
  });

  test('renders download link with correct attributes in development', () => {
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);

    const downloadLink = screen.getByText('Download Merged Skin');
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', `${mockDomain}/download/merged-skin-123456789.png`);
    expect(downloadLink).toHaveAttribute('download');
  });

  test('renders download link with correct attributes in production', () => {
    process.env.NODE_ENV = 'production';
    render(<MergedSkinViewer mergedSkin={mockMergedSkin} />);
    
    const downloadLink = screen.getByText('Download Merged Skin');
    expect(downloadLink).toHaveAttribute('href', `/download/merged-skin-123456789.png`);
    expect(downloadLink).toHaveAttribute('download');
  });
});