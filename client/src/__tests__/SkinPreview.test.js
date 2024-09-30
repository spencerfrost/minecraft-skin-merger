import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SkinPreview from '../components/SkinPreview';

const mockGetContext = jest.fn();
const mockClearRect = jest.fn();
HTMLCanvasElement.prototype.getContext = mockGetContext;

describe('SkinPreview', () => {
  const mockSkins = [
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
    null,
    null
  ];

  const mockSelectedParts = {
    Head: 0,
    Body: 1,
    'Left Arm': 0,
    'Right Arm': 1
  };

  beforeEach(() => {
    mockGetContext.mockReturnValue({
      clearRect: mockClearRect,
      imageSmoothingEnabled: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders canvas element', () => {
    render(<SkinPreview skins={mockSkins} selectedParts={mockSelectedParts} />);
    const canvasElement = screen.getByTestId('skin-preview-canvas');
    expect(canvasElement).toBeInTheDocument();
    expect(canvasElement).toHaveAttribute('width', '192');
    expect(canvasElement).toHaveAttribute('height', '384');
  });

  test('applies correct inline styles to canvas', () => {
    render(<SkinPreview skins={mockSkins} selectedParts={mockSelectedParts} />);
    const canvasElement = screen.getByTestId('skin-preview-canvas');
    expect(canvasElement).toHaveStyle('imageRendering: pixelated');
  });

  test('renders with empty skins array', () => {
    render(<SkinPreview skins={[]} selectedParts={{}} />);
    const canvasElement = screen.getByTestId('skin-preview-canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  test('renders with null selectedParts', () => {
    render(<SkinPreview skins={mockSkins} selectedParts={null} />);
    const canvasElement = screen.getByTestId('skin-preview-canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  test('sets imageSmoothingEnabled to false', () => {
    render(<SkinPreview skins={mockSkins} selectedParts={mockSelectedParts} />);
    expect(mockGetContext).toHaveBeenCalledWith('2d');
    expect(mockGetContext.mock.results[0].value.imageSmoothingEnabled).toBe(false);
  });

  test('clears the canvas', () => {
    render(<SkinPreview skins={mockSkins} selectedParts={mockSelectedParts} />);
    expect(mockClearRect).toHaveBeenCalledWith(0, 0, 192, 384);
  });
});
