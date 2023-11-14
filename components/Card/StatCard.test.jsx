import { render, screen } from "@testing-library/react";
import StatCard from "./StatCard";

var mockIcon = null;
var mockTitle = "Title";
var mockContent = null;

const customRender = () => {
  render(<StatCard icon={mockIcon} title={mockTitle} content={mockContent} />);
};

describe("StatCard component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("StatCard");
    expect(container).toBeInTheDocument();
  });
});
