import { render, screen } from "@testing-library/react";
import RenunciarLlamadoModal from "./RenunciarLlamadoModal";
import { Provider } from "react-redux";
import store from "@/store/store";

var mockSetOpen = jest.fn();
var mockLlamadoId = 1;

const customRender = () => {
  render(
    <Provider store={store}>
      <RenunciarLlamadoModal setOpen={mockSetOpen} llamadoId={mockLlamadoId} />
    </Provider>
  );
};

describe("RenunciarLlamadoModal component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("ModalConfirmation");
    expect(container).toBeInTheDocument();
  });
});
