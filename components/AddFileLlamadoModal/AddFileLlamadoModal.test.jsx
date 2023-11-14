import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddFileLlamadoModal from "./AddFileLlamadoModal";
import { Provider } from "react-redux";
import store from "@/store/store";
import React from "react";

var mockQuery = "query";
var mockSetOpen = jest.fn();
var mockArchivos = [];
jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(() => ({
    query: mockQuery,
  })),
}));

let mockLoading = false;
var mockData = null;
let mockHandleMutation = jest.fn();

let mockError = undefined;
let mockName = "";
let mockFormSubmitted = false;
let mockSelectedFile = undefined;
let mockSelectedFileType = 0;
let mockExistsWithSameType = false;

const default_files = [
  {
    id: 1,
    nombre: "File 1",
    url: "http://file.com",
    extension: "jpg",
    tipoArchivo: {
      id: 1,
      nombre: "Tipo 1",
    },
  },
];

let mockSetError = jest.fn();
let mockSetName = jest.fn();
let mockSetFormSubmitted = jest.fn();
let mockSetSelectedFile = jest.fn();
let mockSetSelectedFileType = jest.fn();
let mockSetExistsWithSameType = jest.fn();

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useQuery: () => ({
    isLoading: mockLoading,
    data: mockData,
  }),
  useMutation: () => [jest.fn(() => mockHandleMutation())],
}));

const Component = () => {
  return (
    <Provider store={store}>
      <AddFileLlamadoModal setOpen={mockSetOpen} archivos={mockArchivos} />
    </Provider>
  );
};

const changeFieldsStates = () => {
  jest
    .spyOn(React, "useState")
    .mockImplementationOnce(() => [mockError, mockSetError])
    .mockImplementationOnce(() => [mockName, mockSetName])
    .mockImplementationOnce(() => [mockFormSubmitted, mockSetFormSubmitted])
    .mockImplementationOnce(() => [mockSelectedFile, mockSetSelectedFile])
    .mockImplementationOnce(() => [
      mockSelectedFileType,
      mockSetSelectedFileType,
    ])
    .mockImplementationOnce(() => [
      mockExistsWithSameType,
      mockSetExistsWithSameType,
    ])
};

describe("AddFileLLamaodModal component", () => {
  beforeEach(() => {
    cleanup();
    mockSetOpen = jest.fn();
    changeFieldsStates();
    render(<Component />);
  });

  it("should render the correct container", () => {
    const item = screen.getByTestId("container");
    expect(item).toBeInTheDocument();
  });

  it("should render the correct title", () => {
    const title = screen.getByText("Agregar Archivo");
    expect(title).toBeInTheDocument();
  });

  it("should render the correct subtitle", () => {
    const subtitle = screen.getByText(
      "Permite agregar nuevos archivos en un llamado, con cualquier extensión."
    );
    expect(subtitle).toBeInTheDocument();
  });

  it("should render the correct cancel button", () => {
    const cancelButton = screen.getByText("Cancelar");
    expect(cancelButton).toBeInTheDocument();
  });

  it("should render the correct submit button", () => {
    const submitButton = screen.getByText("Agregar");
    expect(submitButton).toBeInTheDocument();
  });

  it("should close modal if user click on close button", () => {
    const closeButton = screen.getByTestId("CloseButton");
    fireEvent.click(closeButton);
    expect(mockSetOpen).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("should close modal if user click on cancelar button", () => {
    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);
    expect(mockSetOpen).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("should render the correct nombre label", () => {
    const nombreLabel = screen.getByText("Nombre");
    fireEvent.click(nombreLabel);
    expect(nombreLabel).toBeInTheDocument();
  });

  describe("when form has invalid fields", () => {
    beforeEach(() => {
      cleanup();
    });

    it("should render the correct invalid nombre input", () => {
      mockFormSubmitted = true;
      mockName = undefined;
      changeFieldsStates();
      render(<Component />);
      const invalidUnputName = screen.getByTestId("Nombre-invalid");
      expect(invalidUnputName).toBeInTheDocument();
    });

    it("should render the correct invalid tipo dropdown", () => {
      mockFormSubmitted = true;
      mockSelectedFileType = undefined;
      changeFieldsStates();
      render(<Component />);
      const invalidTipoInput = screen.getByTestId("Seleccione un tipo-invalid");
      expect(invalidTipoInput).toBeInTheDocument();
    });

    it("should render the correct invalid tipo dropzone", () => {
      mockFormSubmitted = true;
      mockSelectedFile = undefined;
      changeFieldsStates();
      render(<Component />);
      const invalidDropzoneInput = screen.getByTestId("dropzone-invalid");
      expect(invalidDropzoneInput).toBeInTheDocument();
    });

    it("should render the correct line error", () => {
      mockError = "Error algo";
      changeFieldsStates();
      render(<Component />);
      const errorLine = screen.getByText("Error algo");
      expect(errorLine).toBeInTheDocument();
    });
  });

  describe("when user tries to submit a exists selected file", () => {
    beforeEach(() => {
      cleanup();
      mockArchivos = default_files;
      mockData = {
        listTiposArchivo: [
          {
            id: 1,
            nombre: "Tipo 1",
          },
          {
            id: 2,
            nombre: "Tipo 2",
          },
        ],
      };
      mockSelectedFileType = 1;
      mockExistsWithSameType = true;
      changeFieldsStates();
      render(<Component />);
    });

    it("should call to setExistsWithSameType state in true", async () => {
      var buttonSubmit = screen.getByText("Agregar");
      fireEvent.click(buttonSubmit);
      expect(mockSetExistsWithSameType).toHaveBeenCalled();
    });

    it("should render the already exists modal", async () => {
        const text = screen.getByText("Sí, agregar");
        expect(text).toBeInTheDocument();
      });
  });
});
