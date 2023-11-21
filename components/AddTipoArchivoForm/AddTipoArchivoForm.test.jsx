import { render, screen, cleanup } from "@testing-library/react";
import AddTipoArchivoForm from "./AddTipoArchivoForm";
import { Provider } from "react-redux";
import store from "@/store/store";
import { useFormContext } from "react-hook-form";

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: jest.fn(),
}));

const mockFormContext = {
  register: jest.fn(),
  setValue: jest.fn(),
  formState: { errors: {} },
};

const Component = () => {
  return (
    <Provider store={store}>
      <AddTipoArchivoForm normalErrors={[]} selectedTipoArchivo={null} />
    </Provider>
  );
};

useFormContext.mockReturnValue(mockFormContext);

describe("AddTipoArchivoForm", () => {
  beforeEach(() => {
    cleanup();
    render(<Component />);
  });
  it("should render the correct form", () => {
    const container = screen.getByTestId("Container");
    expect(container).toBeInTheDocument();
  });

  it("should render the correct label Nombre", () => {
    const labelNombre = screen.getByText("Nombre");
    expect(labelNombre).toBeInTheDocument();
  });

  it("should render the correct label Origen", () => {
    const labelOrigen = screen.getByText("Origen");
    expect(labelOrigen).toBeInTheDocument();
  });

  describe("when has selectedTipoArchivo", () => {
    it("should set values", () => {
      const selectedTipoArchivo = {
        nombre: "TDR",
        origen: "llamado",
      };

      render(
        <Provider store={store}>
          <AddTipoArchivoForm
            normalErrors={[]}
            selectedTipoArchivo={selectedTipoArchivo}
          />
        </Provider>
      );

      expect(mockFormContext.setValue).toHaveBeenCalledWith(
        "nombre",
        selectedTipoArchivo.nombre
      );

      expect(mockFormContext.setValue).toHaveBeenCalledWith(
        "origen",
        selectedTipoArchivo.origen
      );
    });
  });
});
