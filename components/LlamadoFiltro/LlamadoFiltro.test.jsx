import { render, screen } from "@testing-library/react";
import LlamadoFiltro from "./LlamadoFiltro";
import { Provider } from "react-redux";
import store from "@/store/store";

var mockSetOpen = jest.fn();
var mockRefetch = jest.fn();
var mockOnClear = jest.fn();

const customRender = () => {
  render(
    <Provider store={store}>
      <LlamadoFiltro
        setOpen={mockSetOpen}
        refetch={mockRefetch}
        onClear={mockOnClear}
      />
    </Provider>
  );
};

describe("LlamadoFiltro component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("LlamadoFiltro");
    expect(container).toBeInTheDocument();
  });
});
