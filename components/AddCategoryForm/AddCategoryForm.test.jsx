import { cleanup, render, screen } from "@testing-library/react";
import AddCategoryForm from "./AddCategoryForm";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import "@testing-library/jest-dom";

var mockNormalErrors = [];
var mockSelectedCategory = undefined;

var mockYupErrors = {
  nombre: {
    message: "Otro error",
  },
};
let mockSetValue = jest.fn();

const default_selected_category = {
  id: 1,
  nombre: "",
  updatedAt: "09-09-2022",
};

let defaultForm = {
  name: "",
};

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
      <AddCategoryForm
        normalErrors={mockNormalErrors}
        selectedCategory={mockSelectedCategory}
      />
    </FormProvider>
  );
};

describe("AddCategoryForm component", () => {
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
          message: "Otro error",
        },
      };
      render(<Component />);
    });

    it("should render the correct error line", () => {
      const errorText = screen.getByText("Otro error");
      expect(errorText).toBeInTheDocument();
    });
  });

  describe("when has selectedCategory", () => {
    beforeEach(() => {
      cleanup();
      mockSelectedCategory = default_selected_category;
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
      expect(mockSetValue).toHaveBeenCalledWith("nombre", "");
    });
  });
});
