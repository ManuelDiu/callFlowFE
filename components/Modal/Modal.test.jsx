import { render, screen } from "@testing-library/react";
import Modal from "./Modal";

var mockTitle = "title";
var mockSetOpen = jest.fn();
var mockDescription = "desc";
var mockContent = "content";
var mockOnSubmit = jest.fn();
var mockOnCancel = jest.fn();
var mockBottomActiosn = jest.fn();
var mockTextok = "Ok";
var mockTextcancel = "Cancelar";
var mockClassName = "class";
var mockModalClassname = "modalClass";

const customRender = () => {
  render(
    <Modal
      title={mockTitle}
      setOpen={mockSetOpen}
      description={mockDescription}
      content={mockContent}
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
      bottomActiosn={mockBottomActiosn}
      textok={mockTextok}
      textcancel={mockTextcancel}
      className={mockClassName}
      modalClassname={mockModalClassname}
    />
  );
};

describe("Modal component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("Modal");
    expect(container).toBeInTheDocument();
  });
});
