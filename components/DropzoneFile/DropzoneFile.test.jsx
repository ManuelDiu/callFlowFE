import { render, screen } from "@testing-library/react";
import DropzoneFile from "./DropzoneFile";

var mockSetFile = jest.fn();
var mockIsInvalid = false;
var mockAccept = "";

const customRender = () => {
  render(
    <DropzoneFile
      setFile={mockSetFile}
      isInvalid={mockIsInvalid}
      accept={mockAccept}
    />
  );
};

describe("DropzoneFile component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("dropzone");
    expect(container).toBeInTheDocument();
  });
});
