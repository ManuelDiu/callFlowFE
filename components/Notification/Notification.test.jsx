import { render, screen } from "@testing-library/react";
import Notification from "./Notification";

var mockTitle = "";
var mockTime = 300;
var mockText = "";
var mockUsesButtons = false;

const customRender = () => {
  render(
    <Notification
      title={mockTitle}
      time={mockTime}
      text={mockText}
      usesButtons={mockUsesButtons}
    />
  );
};

describe("Notification component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("Notification");
    expect(container).toBeInTheDocument();
  });
});
