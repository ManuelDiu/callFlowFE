import { cleanup, render, screen } from "@testing-library/react";
import AddCargoForm from "./AddCargoForm";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import "@testing-library/jest-dom";

var mockNormalErrors = [];
var mockSelectedCargo = undefined;

var default_selected_cargo = {
  id: 1,
  nombre: "Cargo 1",
}

var mockYupErrors = {
  nombre: {
    message: "Tips invalidos"
  }
};

let defaultForm = {
  name: "",
};

var mockSetValue = jest.fn();

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: jest.fn(),
  useController: jest.fn(),
}));
useFormContext.mockReturnValue({
  handleSubmit: jest.fn(),
  register: jest.fn(),
  setValue: mockSetValue,
  formState: { errors: mockYupErrors },
});

const Component = () => {
  const timepickerField = useForm({
    defaultValues: defaultForm,
  });
  return (
    <FormProvider {...timepickerField}>
      <AddCargoForm
        normalErrors={mockNormalErrors}
        selectedCargo={mockSelectedCargo}
      />
    </FormProvider>
  );
};

describe("AddCargoForm component", () => {
  beforeEach(() => {
    cleanup();
    render(<Component />);
  });

  it("should render the correct form", () => {
    const item = screen.getByTestId("Container");
    expect(item).toBeInTheDocument();
  });

  it("should render the correct label nombre", () => {
    const labelNombre = screen.getByText("Nombre");
    expect(labelNombre).toBeInTheDocument();
  });

  it("should render the correct label tips", () => {
    const labelTips = screen.getByText(
      "Tips a recordar al momento de las entrevistas"
    );
    expect(labelTips).toBeInTheDocument();
  });

  describe("when normal has errors", () => {
    beforeEach(() => {
      cleanup();
      mockNormalErrors = ["Nombre invalido"];
      render(<Component />);
    });

    it("should render the correct error line", () => {
      const errorText = screen.getByText("Nombre invalido");
      expect(errorText).toBeInTheDocument();
    });
  });

  describe("when has yup errors", () => {
    beforeEach(() => {
      cleanup();
      mockYupErrors = {
        nombre: {
          message: "Tips invalidos",
        },
      };
      render(<Component />);
    });

    it("should render the correct error line", () => {
      const errorText = screen.getByText("Tips invalidos");
      expect(errorText).toBeInTheDocument();
    });
  });

  describe("when has selectedCargo", () => {
    beforeEach(() => {
      cleanup();
      mockSelectedCargo = default_selected_cargo;
      mockSetValue = jest.fn();
      useFormContext.mockReturnValue({
        handleSubmit: jest.fn(),
        register: jest.fn(),
        setValue: mockSetValue,
        formState: { errors: mockYupErrors },
      });
      render(<Component />);
    });

    it("should call to setValue to nombre", () => {
      expect(mockSetValue).toHaveBeenCalled();
      expect(mockSetValue).toHaveBeenCalledWith("nombre", "Cargo 1");
    });
  });
});
