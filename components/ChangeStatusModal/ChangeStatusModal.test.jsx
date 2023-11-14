import { render, screen } from "@testing-library/react";
import ChangeStatusModal from "./ChangeStatusModal";
import { Provider } from "react-redux";
import store from "@/store/store"

var mockSetOpen = null;
var mockLlamadoInfo = "Title";
var mockOnOpenDisponibilidad = null;

const customRender = () => {
  render(
    <Provider store={store}>
    <ChangeStatusModal
      setOpen={mockSetOpen}
      llamadoInfo={mockLlamadoInfo}
      onOpenDisponibilidad={mockOnOpenDisponibilidad}
    />
    </Provider>

  );
};

describe("ChnageStatusModal component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("ChangeStatusModal");
    expect(container).toBeInTheDocument();
  });
});
