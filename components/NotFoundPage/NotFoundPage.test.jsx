import { render, screen } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage";

const customRender = () => {
  render(<NotFoundPage />);
};

describe("NotFoundPage component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("NotFoundPage");
    expect(container).toBeInTheDocument();
  });
});
