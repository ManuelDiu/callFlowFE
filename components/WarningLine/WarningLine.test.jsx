import { render, screen } from "@testing-library/react";
import WarningLine from "./WarningLine";

var mockItems = [];

const customRender = () => {
  render(<WarningLine />);
};

describe("WarningLine component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("WarningLine");
    expect(container).toBeInTheDocument();
  });
});
