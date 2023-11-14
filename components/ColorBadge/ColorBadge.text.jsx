import { render, screen } from "@testing-library/react";
import ColorBadge from "./ColorBadge";

var mockColor = null;
var mockClassName = "Title";

const customRender = () => {
  render(<ColorBadge color={mockColor} className={mockClassName} />);
};

describe("ColorBadge component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("ColorBadge");
    expect(container).toBeInTheDocument();
  });
});
