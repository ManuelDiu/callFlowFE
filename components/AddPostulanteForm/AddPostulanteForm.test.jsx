import { cleanup, render, screen } from "@testing-library/react";
import AddPostulanteForm from "./AddPostulanteForm";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import "@testing-library/jest-dom";

var mockNormalErrors = [];
var mockSelectedCargo = undefined;

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
      <AddPostulanteForm
        normalErrors={mockNormalErrors}
        selectedCargo={mockSelectedCargo}
      />
    </FormProvider>
  );
};

describe("AddPostulanteForm component", () => {
  beforeEach(() => {
    cleanup();
    render(<Component />);
  });

  it("should render the correct form", () => {
    const container = screen.getByTestId("Container");
    expect(container).toBeInTheDocument();
  })

  it("should render the correct nombres label", () => {
    const nombres = screen.getByText("Nombres");
    expect(nombres).toBeInTheDocument();
  })

  it("should render the correct apellidos label", () => {
    const apellidos = screen.getByText("Apellidos");
    expect(apellidos).toBeInTheDocument();
  })

  it("should render the correct documento label", () => {
    const documento = screen.getByText("Documento");
    expect(documento).toBeInTheDocument();
  });
});
