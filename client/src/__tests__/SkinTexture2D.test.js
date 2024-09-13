import { render, waitFor } from '@testing-library/react';
import SkinTexture2D from '../components/SkinTexture2D.js';

const mockSkinUrl = 'http://example.com/skin.png';

describe('SkinTexture2D', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
      })
    );
  });

  it('renders without crashing', () => {
    render(<SkinTexture2D skinUrl={mockSkinUrl} />);
  });

  it('displays loading state initially', async () => {
    const { getByText } = render(<SkinTexture2D skinUrl={mockSkinUrl} />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the image when loaded successfully', async () => {
    const { getByAltText } = render(<SkinTexture2D skinUrl={mockSkinUrl} />);
    await waitFor(() => {
      expect(getByAltText('Skin Texture')).toBeInTheDocument();
    });
  });

});
