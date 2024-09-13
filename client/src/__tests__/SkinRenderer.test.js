import { render } from "@testing-library/react";
import SkinRenderer from "../components/SkinRenderer.js";

describe("SkinRenderer", () => {
  const mockSkinUrl = "http://example.com/skin.png";
  const mockSkinIndex = 0;
  const mockSelectedParts = {};
  const mockOnPartSelection = jest.fn();

  it("renders without crashing", () => {
    render(
      <SkinRenderer
        skinUrl={mockSkinUrl}
        skinIndex={mockSkinIndex}
        selectedParts={mockSelectedParts}
        onPartSelection={mockOnPartSelection}
      />
    );
  });

  it("renders a canvas element", () => {
    const { container } = render(
      <SkinRenderer
        skinUrl={mockSkinUrl}
        skinIndex={mockSkinIndex}
        selectedParts={mockSelectedParts}
        onPartSelection={mockOnPartSelection}
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  // Add more tests here to cover different scenarios and interactions
});
