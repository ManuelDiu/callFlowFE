import { render, screen } from "@testing-library/react";
import Button from "./Button";

var mockText = "text";
var mockAction = jest.fn();
var mockType = "submit";
var mockVariant = "fill";
var mockSizeVariant = "lg";
var mockClassName = "class";
var mockRounded = "lg";
var mockIcon = null;
var mockDisabled = false;
var mockTitle = "title";

const customRender = () => {
  render(
    <Button
      text={mockText}
      action={mockAction}
      type={mockType}
      variant={mockVariant}
      sizeVariant={mockSizeVariant}
      className={mockClassName}
      rounded={mockRounded}
      icon={mockIcon}
      disabled={mockDisabled}
      title={mockTitle}
    />
  );
};

describe("Button component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct button component", () => {
    const container = screen.getByTestId("Button");
    expect(container).toBeInTheDocument();
  });
});
