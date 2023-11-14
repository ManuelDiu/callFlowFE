import { render, screen } from "@testing-library/react";
import AddTipoArchivoForm from "./AddTipoArchivoForm";
import { Provider } from "react-redux";
import store from "@/store/store";
import { useFormContext } from "react-hook-form";

var mockNormalErrors = {};
var mockSelectedTipoArchivo = null;

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: jest.fn(),
  useController: jest.fn(),
}));

useFormContext.mockReturnValue({
  handleSubmit: jest.fn(),
  register: jest.fn(),
  setValue: jest.fn(),
  formState: { errors: {} },
});

const customRender = () => {
  render(
    <Provider store={store}>
      <AddTipoArchivoForm
        normalErrors={mockNormalErrors}
        selectedTipoArchivo={mockSelectedTipoArchivo}
      />
    </Provider>
  );
};

describe("AddTipoArchivoForm", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("Container");
    expect(container).toBeInTheDocument();
  });
});
