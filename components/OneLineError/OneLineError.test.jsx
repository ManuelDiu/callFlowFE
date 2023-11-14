import { render, screen } from "@testing-library/react";
import OneLineError from "./OneLineError";

var mockMessage = "";

const customRender = () => {
  render(<OneLineError message={mockMessage} />);
};

describe("OneLineError component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("OneLineError");
    expect(container).toBeInTheDocument();
  });
});
