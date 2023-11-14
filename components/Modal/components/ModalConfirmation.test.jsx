import { render, screen } from "@testing-library/react";
import ModalConfirmation from "./ModalConfirmation";

var mocktitle = "title";
var mocksetOpen = jest.fn();
var mockdescription = "desc";
var mockcontent = "content";
var mockonSubmit = jest.fn();
var mockonCancel = jest.fn();
var mocktextok = jest.fn();
var mocktextcancel = "Ok";
var mockvariant = "Cancelar";

const customRender = () => {
  render(
    <ModalConfirmation
      title={mocktitle}
      setOpen={mocksetOpen}
      description={mockdescription}
      content={mockcontent}
      onSubmit={mockonSubmit}
      onCancel={mockonCancel}
      textok={mocktextok}
      textcancel={mocktextcancel}
      variant={mockvariant}
    />
  );
};

describe("ModalConfirmation component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("ModalConfirmation");
    expect(container).toBeInTheDocument();
  });
});
