import { render, screen } from "@testing-library/react";
import LlamadoProgress from "./LlamadoProgress";

var progress = 15;

const customRender = () => {
  render(<LlamadoProgress progress={progress} />);
};

describe("LlamadoProgress component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("LlamadoProgress");
    expect(container).toBeInTheDocument();
  });
});
